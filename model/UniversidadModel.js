var mongoose = require('mongoose');
const coordenadas = {longitud:String , latitud:String};
var UniversidadEsquema = mongoose.Schema({
    nombre_largo:{type : String, require : true ,unique: true},
    nombre:{type : String, require : true ,unique: true},
    coordenadas : coordenadas
});
module.exports = mongoose.model("universidad",UniversidadEsquema,"universidad");