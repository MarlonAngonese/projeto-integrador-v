const {Schema} = require('mongoose');

module.exports = new Schema({
    email: String,
    subject: String,
    description: String,
    status: Boolean
});