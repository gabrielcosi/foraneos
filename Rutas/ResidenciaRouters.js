const Residencia = require('../controller/ResidenciaController');
module.exports = (router) =>{
    router.post('/crearresi',Residencia.RevisarToken,Residencia.CrearResi);
    router.put('/actualizaruni/:iduni',Residencia.RevisarToken,Residencia.ActualizarResi)
    router.get('/listarresibyuni/:id',Residencia.RevisarToken,Residencia.ListarByUni);
    router.post('/crearcuarto',Residencia.RevisarToken,Residencia.CrearCuartos);
}
