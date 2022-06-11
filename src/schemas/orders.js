const {Schema} = require('mongoose');

module.exports = new Schema({
    payment: String,
    products: Array,
    client: Schema.Types.ObjectId,
});