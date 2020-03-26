const Residencia = require('../controller/ResidenciaController');
module.exports = (router) =>{
    router.post('/crearresi',Residencia.RevisarToken,Residencia.CrearResi);
    router.put('/actualizaruni/:iduni',Residencia.RevisarToken,Residencia.ActualizarResi)
    router.get('/listarresibyuni/:id',Residencia.ListarByUni);
    router.put('/crearcuarto/:id/:piso',Residencia.RevisarToken,Residencia.CrearCuartos);
    router.put('/eliminarcuarto/:id/:piso/:cuarto',Residencia.RevisarToken,Residencia.EliminarCuartos);
    router.put('/actualizarcuarto/:id/:piso/:cuarto',Residencia.RevisarToken,Residencia.ActualizaCuarto);
    router.put('/cambiarestado/:id/:piso/:cuarto',Residencia.RevisarToken,Residencia.CambiarEstado);
}
