const {Schema} = require('mongoose');

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