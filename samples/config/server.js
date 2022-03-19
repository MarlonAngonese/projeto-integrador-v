const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const database = require('../mongodb/database')
const mongoose = require('mongoose');
const ClientsSchema = require('../schemas/clients');
const TextsSchema = require('../schemas/texts');
const CategoriesSchema = require('../schemas/categories');
const ProductsSchema = require('../schemas/products');
const routes = require('../front-routes/routes');

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

// MONGO CONNECTION
database();
      
// SCHEMAS
const Clients = mongoose.model('clients', ClientsSchema);
const Texts = mongoose.model('texts', TextsSchema);
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

//GET TEXTS ANNOTATION
app.get('/text', (req, res) => {
  Texts.find((err, texts) => {
    res.render('text.html', {texts: texts});
  });
});

// POST TEXT ANNOTATION
app.post('/text', (req, res) => {
  var text = new Texts(req.body);

  text.save((err, text) => {
    console.info(text.info + ' salvo');
    res.send('ok');

    if(err) {
      console.error(err)
    }
  })
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