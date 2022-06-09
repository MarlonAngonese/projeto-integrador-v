const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const database = require('../mongodb/database')
const mongoose = require('mongoose');
const ClientsSchema = require('../schemas/clients');
const ContactsSchema = require('../schemas/contact');
const CategoriesSchema = require('../schemas/categories');
const ProductsSchema = require('../schemas/products');
const routes = require('../front-routes/routes');
const md5 = require('md5');
const session = require('express-session');

const uploader = require('../middleware/uploaderImg')
const uploadGoogleDrive = require('../api/googledrive/auth')

const cors = require('cors')
// SERVER CONFIGURATION
var port = process.env.PORT || 3030;

let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('engine', env);
require('useful-nunjucks-filters')(env);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
}));

app.use(express.static('public'));

app.listen(port, () => {
    console.log('LISTEN ON PORT ' + port);
});

// CONFIGURE SESSION
app.use(session({
    secret: 'kiosndfw8h8348urg2h8bfnedu',
    resave: true,
    saveUninitialized: true,
}));

// MONGO CONNECTION
database();

// SCHEMAS
const Clients = mongoose.model('clients', ClientsSchema);
const Contacts = mongoose.model('contact', ContactsSchema);
const Categories = mongoose.model('categories', CategoriesSchema);
const Products = mongoose.model('products', ProductsSchema);

// CONFIG CATEGORIES
app.use((req, res, next) => {
    const engine = res.app.get('engine');
    Categories.aggregate([{
        $lookup: {
            from: "products", // collection name in db
            localField: "_id",
            foreignField: "category",
            as: "products"
        }
    }]).sort('name').exec((err, obj) => {
        engine.addGlobal('categories', obj);
        next();
    });
});

// MIDDLEWARE
const authChecker = (req, res, next) => {
    if (req.session.client) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.post('/login', async (req, res) => {
    resultado = await Clients.find({ //pesquisa em clientes os dados do formulario
        email: req.body.email,
        password: md5(req.body.password) //pesquisa senha criptografada
    }).limit(1).exec();

    if (resultado.length == 0) { //confere se encontrou pelo menos um usuario com os dados do login 
        res.send({ 'status': 500 })
    } else {
        req.session.client = resultado;
        res.send({ 'status': 200, 'client': req.session.client })
    }
});

// Register new Client
app.post('/register', (req, res) => {
    var client = new Clients(req.body);

    if (client.password && client.password.length > 0) {
        client.password = md5(client.password);

        if (client.confirmPassword && client.confirmPassword.length > 0) {
            client.confirmPassword = md5(client.confirmPassword);
        }
    }

    client.save((err, client) => {
        console.info(client.name + ' salvo');
        res.send('ok');

        if (err) {
            console.error(err)
        }
    })
});

// POST CONTACT 
app.post('/contact', (req, res) => {
    try {
        var email = req.body.email;
        var subject = req.body.subject;
        var description = req.body.description;
        req.body.status = false;

        if (email && subject && description) {
            var contact = new Contacts(req.body);
            contact.save((err, contact) => {
                console.info(contact.email + ' salvo');
                return res.status(200).json({ success: true, result: contact, status: 200 });
            })
        } else {
            throw 'Ops, ocorreu um erro ao enviar, por favor, tente mais tarde.'
        }
    } catch (error) {
        return res.json({ success: false, message: error, status: 500 });
    }
});

// POST CATEGORY
app.post('/admin/categories/add', (req, res) => {
    var categories = new Categories(req.body);
    categories.save((err, categories) => {
        console.info('Categoria ' + categories.name + ' salva');
        res.send('ok');
    })
});

// DELETE CATEORY
app.delete('/admin/category/delete/:id', (req, res) => {
    Categories.findOneAndRemove({ _id: req.params.id }, (err, obj) => {
        if (err) {
            res.send('error');
        }
        res.send('ok');
    });
});

// POST PRODUCT
app.post('/insertProducts', cors(), uploader.array('images'), async (req, res) => {
    try {
        if (!req.files) {
            throw "Você precisa fazer upload de um arquivo de imagem válido"
        }

        //Send image to google drive
        let result = await uploadGoogleDrive(req.files);

        if (!result) {
            throw "Não foi possível fazer o upload da imagem no Google Drive"
        }

        req.body.url = result;

        let product = new Products(req.body);
        product.save().then(() => {
            res.send({ 'status': 200 })
        }).catch((err) => {
            res.send({ 'status': 500 })
        });
    } catch (err) {
        res.send({ 'status': 500 })
    }
});

// UPDATE PRODUCT
app.post('/admin/products/update/:id', uploader.array('images'), async (req, res) => {
    let product = await Products.findOne({_id: req.params.id});

    try {
        if (req.files.length > 0) {
            //Send image to google drive
            let result = await uploadGoogleDrive(req.files);

            if (!result) {
                throw "Não foi possível fazer o upload da imagem no Google Drive"
            }

            product.url = result;
        }

        product.name = (req.body.name != product.name) ? req.body.name : product.name
        product.category = (req.body.category != product.category) ? req.body.category : product.category
        product.price = (req.body.price != product.price) ? req.body.price : product.price
        product.description = (req.body.description != product.description) ? req.body.description : product.description

        product.save().then(() => {
            res.send({ 'status': 200 })
        }).catch((err) => {
            res.send({ 'status': 500 })
        });
    } catch (err) {
        res.send({ 'status': 500 })
    }
})

// DELETE PRODUCT
app.delete('/admin/products/delete/:id', (req, res) => {
    Products.findOneAndRemove({ _id: req.params.id }, (err, obj) => {
        if (err) {
            res.send('error');
        }
        res.send('ok');
    });
});

// EXTERNAL ROUTES
app.use('/', routes);