var mongoose = require('mongoose');
const coordenadas = {longitud:String , latitud:String};
var UniversidadEsquema = mongoose.Schema({
    nombre:{type : String, require : true ,unique: true},
    coordenadas : coordenadas
});
module.exports = UniversidadEsquema;