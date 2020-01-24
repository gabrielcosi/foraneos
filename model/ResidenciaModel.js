var moongose = require('mongoose');
////propietario
const Propietario = {
    usuario : Number,
    RUC : String
}
/// Pisos
const Pisos = [Cuartos]
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
    Coordenadas : {
            "longitud" : "15.000212120",
            "latitud" : "02.011001110"
    },
    Universidad : Number
});
module.exports = residenciasquema;

    