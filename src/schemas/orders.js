const {Schema} = require('mongoose');
const logger = require('../helpers/logger');
logger.log('info', 'Orders Schema created');

module.exports = new Schema({
    payment: String,
    products: Array,
    client: Schema.Types.ObjectId,
});