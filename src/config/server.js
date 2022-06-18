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
const OrdersSchema = require('../schemas/orders');
const AdminsSchema = require('../schemas/admins')
const routes = require('../front-routes/routes');
const md5 = require('md5');
const session = require('express-session');
const nodemailer = require('nodemailer');

const uploader = require('../middleware/uploaderImg')
const uploadGoogleDrive = require('../api/googledrive/auth')

const cors = require('cors')

const nodeoutlook = require('nodejs-nodemailer-outlook')
const logger = require('../helpers/logger');

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
    logger.log('info', 'LISTEN ON PORT ' + port);
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
const Admins = mongoose.model('admins', AdminsSchema);
const Orders = mongoose.model('orders', OrdersSchema);

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
        logger.log('info', 'Client saved: ' + client);
        res.send('ok');

        if (err) {
            logger.log('error', 'Client saved error: ' + err);
        }
    })
});

// SEND ORDER
app.post('/insertOrders', (req, res) => {
    var order = new Orders(req.body);
    order.save((err, order) => {
        logger.log('info', 'Order saved: ' + order);
        res.send({success: true});

        if (err) {
            logger.log('error', 'Order saved error: ' + err);
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
                logger.log('info', 'Contact saved: ' + contact);

                // send email to Malotech
                // nodeoutlook.sendEmail({
                //     auth: {
                //         user: "malotechstore@outlook.com",
                //         pass: "Malotech2022"
                //     },
                //     from: 'malotechstore@outlook.com',
                //     to: 'malotechstore@outlook.com',
                //     subject: subject,
                //     html:   '<div style="justify-content-center; text-align: center;">'+
                //                 '<div><h2>Malotech Store</h2></div>'+
                //                 '<div style="margin-bottom: 10px;"><h4>'+email+' entrou em contato!</h4></div>'+
                //                 '<div><b>Descrição do chamado:</b></div>'+
                //                 '<div><span>'+description+'</span></div>'+
                //             '</div>',
                //     // text: answer,
                //     replyTo: email,
                //     onError: (e) => {
                //         // res.send({success: false});
                //     },
                //     onSuccess: (i) => {
                //         // res.send({success: true});
                //     }
                // });
                
                // send email to Client
                nodeoutlook.sendEmail({
                    auth: {
                        user: "malotechstore@outlook.com",
                        pass: "Malotech2022"
                    },
                    from: 'malotechstore@outlook.com',
                    to: email,
                    subject: 'Malotech Store - Recebemos seu contato',
                    html:   '<div style="justify-content-center; text-align: center;">'+
                                '<div><h2>Malotech Store</h2></div>'+
                                '<div style="margin-bottom: 10px;"><h4>Olá, recebemos seu chamado em nosso site!</h4></div>'+
                                '<div style="margin-bottom: 10px;"><h4>Nossa equipe irá analisar e em breve iremos retornar uma resposta.</h4></div>'+
                                '<div><b>Equipe Malotech</b></div>'+
                            '</div>',
                    // text: answer,
                    replyTo: 'malotechstore@outlook.com',
                    onError: (e) => {
                        logger.log('Error', 'Send e-mail to client error: ' + e);

                        // res.send({success: false});
                    },
                    onSuccess: (i) => {
                        logger.log('info', 'Send e-mail to client: ' + i);
                        // res.send({success: true});
                    }
                });
                
                return res.status(200).json({ success: true, result: contact, status: 200 });
            })
        } else {
            logger.log('error', 'Missing informations on create contact');
            throw 'Ops, ocorreu um erro ao enviar, por favor, tente mais tarde.'
        }
    } catch (error) {
        return res.json({ success: false, message: error, status: 500 });
    }
});

// LOGIN ADMIN POST
app.post('/admin/login', async (req, res) => {
    resultado = await Admins.find({ //pesquisa em clientes os dados do formulario
        email: req.body.email,
        password: md5(req.body.password) //pesquisa senha criptografada
    }).limit(1).exec();

    if (resultado.length == 0) { //confere se encontrou pelo menos um usuario com os dados do login 
        res.send({ 'status': 500 })
    } else {
        req.session.admin = resultado;
        res.send({ 'status': 200, 'admin': req.session.admin })
    }
});

// POST ADMINS
app.post('/admin/admins/add', (req, res) => {
    req.body.password = md5(req.body.password);
    var admins = new Admins(req.body);
    admins.save((err, admins) => {
        logger.log('info', 'Admin saved: ' + admins);
        res.send('ok');
    })
});

// DELETE ADMIN
app.delete('/admin/admins/delete/:id', (req, res) => {
    Admins.findOneAndRemove({ _id: req.params.id }, (err, obj) => {
        if (err) {
            logger.log('error', 'Administrator removed error: ' + err);
            res.send('error');
        }
        res.send('ok');
        logger.log('info', 'Aministrador removed');
    });
});

// POST CATEGORY
app.post('/admin/categories/add', (req, res) => {
    var categories = new Categories(req.body);
    categories.save((err, categories) => {
        logger.log('info', 'Category saved: ' + categories);
        res.send('ok');
    })
});

// UPDATE CATEGORY
app.post('/admin/categories/update/:id', async (req, res) => {
    let category = await Categories.findOne({ _id: req.params.id });

    category.name = (req.body.name != category.name) ? req.body.name : category.name
    category.slug = (req.body.slug != category.slug) ? req.body.slug : category.slug

    category.save().then(() => {
        logger.log('info', 'Category updated: ' + category);
        res.send({ 'status': 200 })
    }).catch((err) => {
        logger.log('error', 'Category updated error: ' + err);
        res.send({ 'status': 500 })
    });
});

// DELETE CATEORY
app.delete('/admin/category/delete/:id', (req, res) => {
    Categories.findOneAndRemove({ _id: req.params.id }, (err, obj) => {
        if (err) {
            logger.log('error', 'Category removed error: ' + err);
            res.send('error');
        }
        res.send('ok');
        logger.log('info', 'Category removed');
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
            logger.log('error', 'Error at upload image on Google Drive');
            throw "Não foi possível fazer o upload da imagem no Google Drive"
        }

        req.body.url = result;

        let product = new Products(req.body);
        product.save().then(() => {
            logger.log('info', 'Product saved: ' + product);
            res.send({ 'status': 200 })
        }).catch((err) => {
            logger.log('error', 'Product saved error: ' + err);
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
                logger.log('error', 'Product updated error');
                throw "Não foi possível fazer o upload da imagem no Google Drive"
            }

            product.url = result;
        }

        product.name = (req.body.name != product.name) ? req.body.name : product.name
        product.category = (req.body.category != product.category) ? req.body.category : product.category
        product.price = (req.body.price != product.price) ? req.body.price : product.price
        product.description = (req.body.description != product.description) ? req.body.description : product.description

        product.save().then(() => {
            logger.log('info', 'Product updated: ' + product);
            res.send({ 'status': 200 })
        }).catch((err) => {
            logger.log('error', 'Product updated error: ' + err);
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
            logger.log('error', 'Product removed error: ' + err);
            res.send('error');
        }
        logger.log('info', 'Product removed');
        res.send('ok');
    });
});


// Envio de email
app.post('/send', (req, res) => {
    var id = req.body.id;
    var email = req.body.email;
    var subject = req.body.subject;
    var description = req.body.description;
    var answer = req.body.answer;

    nodeoutlook.sendEmail({
        auth: {
            user: "malotechstore@outlook.com",
            pass: "Malotech2022"
        },
        from: 'malotechstore@outlook.com',
        to: email,
        subject: 'Resposta de solicitação - Malotech',
        html:   '<div style="justify-content-center; text-align: center;">'+
                    '<div><h3>Malotech Store</h3></div>'+
                    '<div style="margin-bottom: 10px;"><h4>Recebemos sua solicitação!</h4></div>'+
                    '<div style="margin-bottom: 10px;"><h4>'+subject+'</h4></div>'+
                    '<div><b>'+answer+'</b></div>'+
                '</div>',
        // text: answer,
        replyTo: 'malotechstore@outlook.com',
        onError: (e) => {
            logger.log('error', 'Send answer email error: ' + e);
            res.send({success: false});
        },
        onSuccess: (i) => {
            const query  = Contacts.where({ _id: id });
            query.findOne(function (err, contact) {
                if (contact) {
                    // contact.email = email;
                    // contact.subject = subject;
                    // contact.description = description;
                    contact.status = true;
                    
                    contact.save().then(() => {
                        logger.log('info', 'Contact status updated');
                        // res.send({ 'status': 200 })
                    }).catch((err) => {
                        logger.log('error', 'Contact status updated error: ' + err);
                        // res.send({ 'status': 500 })
                    });
                };
            });

            // Contacts.updateOne({
            //     _id: 'ObjectId("'+id+'")'
            // }, {
            //     $set: {
            //         status: true
            //     }
            // })
            logger.log('info', 'Send answer email: ' + i);

            res.send({success: true});
        }
    });
});

// EXTERNAL ROUTES
app.use('/', routes);