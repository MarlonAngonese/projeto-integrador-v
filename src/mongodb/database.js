const MONGODB_URL = 'mongodb+srv://Renan:PI5@projeto-integrador-5.hak6p.mongodb.net/DatabasePI?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const logger = require('../helpers/logger');

// MONGO DB CONNECTION
module.exports = () => {
  mongoose.connect(MONGODB_URL, {useNewUrlParser: true}, err => {
    if (!err) {
      logger.log('info', 'MongoDB Connected');
    } else {
      logger.log('error', '[SERVER_ERROR] MongoDB Connection: ' + err);
      process.exit(1);
    };
  });
}