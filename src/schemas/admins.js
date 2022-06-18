const {Schema} = require('mongoose');
const logger = require('../helpers/logger');
logger.log('info', 'Admin Schema created');

module.exports = new Schema({
    name: String,
    email: String,
    password: String,
});