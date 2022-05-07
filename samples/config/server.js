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

// SEARCH PRODUCTS
app.get('/search', (req, res) => {
  const query = req.query.q;
  let cond = [];
  let queryObj = {};

  if (query && query.length > 0) {
    queryObj = {"name": { "$regex": query, "$options": "i" }};
  }
  Products.find(queryObj).sort([cond]).exec((err, products) => {
     res.render('products.html', {products: products, q: query});
 });
});

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

app.get('/c/:slug', (req, res) => {
  Categories.aggregate([
    {$match: {slug: req.params.slug}},
    {
    $lookup: {
        from: "products", // collection name in db
        localField: "_id",
        foreignField: "category",
        as: "products"
    }
    }]).exec((err, obj) => {
      console.info(obj);
        res.render('products.html', {products: obj[0].products});
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

  if (resultado.length == 0 ) { //confere se encontrou pelo menos um usuario com os dados do login 
    res.send("empty");  
  } else {
    req.session.client = resultado;
    console.log(req.session.client);
    res.send(resultado);
  }
}); 

// POST CLIENT
app.post('/client', (req, res) => {
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

    if(err) {
      console.error(err)
    }
  })
});

app.get('/testeee', (req, res) => {
  res.send(req.session.client)
})

// POST CONTACT 
app.post('/contact', (req, res) => {
  try {
    var email = req.body.email;
    var subject = req.body.subject;
    var description = req.body.description;

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
app.post('/categories', (req, res) => {
    var categories = new Categories(req.body);
    categories.save((err, categories) => {
      console.info('Categoria ' + categories.name + ' salva');
      res.send('ok');
    })
});

// DELETE CATEORY
app.delete('/category/:id', (req, res) => {
    Categories.findOneAndRemove({_id: req.params.id}, (err, obj) => {
      if(err) {
        res.send('error');
      }
      res.send('ok');
    });
});

// GET CATEGORY
app.get('/categories', (req, res) => {
  Categories.find((err, obj) => {
    res.render('insertCategory.html', {categories: obj});
  }); 
});


// POST PRODUCT
app.post('/insertproducts', (req, res) => {
  var insertproducts = new Products(req.body);
  insertproducts.save((err, insertproducts) => {
    console.info('Produto ' + insertproducts.name + ' salvo');
    res.send('ok');
  })
});

// GET PRODUCTS
app.get('/insertproducts', (req, res) => {
  Products.find((err, products) => {
      Categories.find().sort('name').exec((err, categories) => {
      res.render('insertProducts.html', {products: products, categories: categories});
    });
  });
});

app.get('/product/:id', (req, res) => {
  Products.find({"_id": req.params.id }, (err, obj) => {
      if (err) {
        // podemos botar uma pagína de 404 aqui
      } else {
        const product = obj[0];
        res.render('product.html', {product: product});
      }
  });
});

app.get('/products', (req, res) => {
  Products.find((err, obj) => {
     res.render('products.html', {products: obj});
 });
});

// DELETE PRODUCT
app.delete('/product/:id', (req, res) => {
  Products.findOneAndRemove({_id: req.params.id}, (err, obj) => {
    if(err) {
      res.send('error');
    }
    res.send('ok');
  });
});

// API PRODUCTS
app.get('/api/products', (req, res) => {
  res.send(listProducts);
});

app.get('/api/product/:id', (req, res) => {
  Products.find({"_id": req.params.id }, (err, obj) => {
      if (err) {
        res.send(null);
      } else {
        const product = obj[0];
        res.send(product);
      }
  });
});

// EXTERNAL ROUTES
app.use('/', routes);