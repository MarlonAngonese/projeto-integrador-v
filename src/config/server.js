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

app.post('/login', (req, res) => {

  req.session.user = req.body.user;

  res.send(req.session);
})

// POST CLIENT
app.post('/client', (req, res) => {
  var client = new Clients(req.body);

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
