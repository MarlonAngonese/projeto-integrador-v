const MONGODB_URL = 'mongodb+srv://Renan:PI5@projeto-integrador-5.hak6p.mongodb.net/DatabasePI?retryWrites=true&w=majority';
const mongoose = require('mongoose');

// MONGO DB CONNECTION
module.exports = () => {
  mongoose.connect(MONGODB_URL, {useNewUrlParser: true}, err => {
    if (!err) {
      console.info(':: MongoDB Connected ::');
    } else {
      console.error('[SERVER_ERROR] MongoDB Connection:', err);
      process.exit(1);
    };
  });
}