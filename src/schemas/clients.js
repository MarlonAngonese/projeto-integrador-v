const {Schema} = require('mongoose');
const logger = require('../helpers/logger');
logger.log('info', 'Clients Schema created');

module.exports = new Schema({
    name: String,
    lastname: String,
    cpf: String,
    email: String,
    birthday: String,
    cellphone: Number,
    cep: Number,
    city: String,
    neighborhood: String,
    street: String,
    number: Number,
    complement: String,
    password: String,
    confirmPassword: String
});