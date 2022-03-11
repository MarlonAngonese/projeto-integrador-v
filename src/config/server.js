const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const database = require('../mongodb/database')
const mongoose = require('mongoose');
const ClientsSchema = require('../schemas/clients');
const TextsSchema = require('../schemas/texts');
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

// EXTERNAL ROUTES
app.use('/', routes);

//Comentario que será commitado