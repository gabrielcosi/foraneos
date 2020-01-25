const Residencia = require('../controller/ResidenciaController');
module.exports = (router) =>{
    router.post('/crearresi',Residencia.RevisarToken,Residencia.CrearResi);
    router.post('/listarresibyuni');
}
