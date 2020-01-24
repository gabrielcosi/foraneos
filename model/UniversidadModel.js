var mongoose = require('mongoose');
const coordenadas = {longitud:String , latitud:String};
var UniversidadEsquema = mongoose.Schema({
    nombre_largo:{type : String, require : true ,unique: true},
    nombre:{type : String, require : true ,unique: true},
    coordenadas : {type : coordenadas, require : true ,unique: true}
});
module.exports = mongoose.model("universidad",UniversidadEsquema,"universidad");