var moongose = require('mongoose');
////propietario
const Propietario = {
    usuario : Number,
    RUC : String
}
/// Coordenadas
const Coordenadas = {longitud:String , latitud:String};
/// Pisos
const Pisos = {
    Nropiso:String,
    cuartos:[Cuartos]}
//// Cuartos
const Cuartos = {
        nrcuarto : String,
        amueblado : Boolean,
        costo : Number,
        tipo : Number,
        costoreserva : Number,
        calificacion : [Calificacion]
}
////Calificacion
const Calificacion = {
    estrella : Number,
    comentario : {
            contenido : String,
            usuario : Number
    }
}
var residenciasquema = moongose.Schema({
    nombre:{type : String, require : true ,unique: true},
    id : {type : Number, require : true ,unique: true},
    propietario : Propietario,
    Cuartos : [Pisos],
    Coordenadas : Coordenadas,
    Universidad : Number
});
module.exports = residenciasquema;

    