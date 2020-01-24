const Univeridad = require('../controller/UniversidadController')
module.exports = (router) => {
    router.post('/crearuni',Univeridad.RevisarToken,Univeridad.CrearUni);
    router.get('/listaruni',Univeridad.RevisarToken,Univeridad.ListarUni);
}