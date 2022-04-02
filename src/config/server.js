const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const database = require('../mongodb/database')
const mongoose = require('mongoose');
const routes = require('../front-routes/routes');
const session = require('express-session');
const ClientsSchema = require('../schemas/clients');
const CategoriesSchema = require('../schemas/categories');
const md5 = require('md5');

// SERVER CONFIGURATION
var port = process.env.PORT || 3000;

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
const Categories = mongoose.model('categories', CategoriesSchema);

// EXTERNAL ROUTES
app.use('/', routes);

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
