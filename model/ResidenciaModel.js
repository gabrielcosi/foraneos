var moongose = require('mongoose');
////propietario
const Propietario = {
    usuario : Number,
    RUC : String
}
/// Coordenadas
const Coordenadas = {longitud:String , latitud:String};
////Calificacion
const Calificacion = {
    estrella : Number,
    comentario : {
            contenido : String,
            usuario : Number
    }
}
//// Cuartos
const Cuartos = {
    nrcuarto : String,
    amueblado : Boolean,
    ocupado:Boolean,
    costo : Number,
    tipo : Number,
    costoreserva : Number,
    calificacion : [Calificacion]
}
/// Pisos
const Pisos = {
    Nropiso:String,
    cuartos:[Cuartos]
}
var residenciasquema = moongose.Schema({
    nombre:{type : String, require : true ,unique: true},
    id : {type : Number, require : true ,unique: true},
    propietario : {type : Propietario, require : true ,unique: true},
    cuartos : [Pisos],
    coordenadas : {type : Coordenadas, require : true ,unique: true},
    universidad : Number
});
module.exports = moongose.model("residencia",residenciasquema,"residencia");

    