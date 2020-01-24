const Univeridad = require('../controller/UniversidadController')
module.exports = (router) => {
    router.get('/listaruni',Univeridad.RevisarToken,Univeridad.ListarUni);
}