var mongoose = require('mongoose');

const UsersEsquema = mongoose.Schema({
    tipo: { type: String, required: true },
    nombre: { type: String, required: true },
    usuario: { type: String, required: true ,unique: true},
    contra: { type: String, required: true },
    opciones: { type: Array, required: true }
});

    module.exports = UsersEsquema;