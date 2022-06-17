const {Schema} = require('mongoose');
const logger = require('../helpers/logger');
logger.log('info', 'Categories Schema created');

module.exports = new Schema({
    name: String,
    slug: String
});