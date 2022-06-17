const {Schema} = require('mongoose');
const logger = require('../helpers/logger');
logger.log('info', 'Contact Schema created');

module.exports = new Schema({
    email: String,
    subject: String,
    description: String,
    status: Boolean
});