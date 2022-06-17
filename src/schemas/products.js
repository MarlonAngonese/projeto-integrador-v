const {Schema} = require('mongoose');
const logger = require('../helpers/logger');
logger.log('info', 'Products Schema created');

module.exports = new Schema({
	category: Schema.Types.ObjectId,
	name: String,
	price: Number,
	description: String,
	url: Array
});