const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const database = require('../mongodb/database')
const mongoose = require('mongoose');
const routes = require('../front-routes/routes');
const session = require('express-session');
const ClientsSchema = require('../schemas/clients');
const clients = require('../schemas/clients');

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

// EXTERNAL ROUTES
app.use('/', routes);
