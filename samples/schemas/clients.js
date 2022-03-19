const {Schema} = require('mongoose');

module.exports = new Schema({
    name: String,
    lastname: String,
    cpf: String,
    email: String,
    birthday: String,
    cep: Number,
    neighborhood: String,
    street: String,
    number: Number,
    complement: String,
    password: String,
    confirmPassword: String
});