const Residencia = require('../model/ResidenciaModel');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretkey123';

//  SECCION DE RESIDENCIA
//// Crear Residencia
exports.CrearResi = (req , res )=>{
    console.log(req)
    jwt.verify(req.token, SECRET_KEY, (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
			Residencia.create(req.body.residencia,(err,doc)=>{
                if (err && err.code === 11000) {
                    return res.status(409).send('Universidad ya existe')
                };
                if (err) {return res.send("falta un campo")} ;
                res.send(doc);
            });
		}
	});
}
//// Actualizar Residencia

//// Listar By Universidad


//// Filtrador

//  SECCION DE CUARTOS
//// Crear Cuartos

//// Encontrar Cuarto By Residencia

//// Listar Cuartos


//  SECCION COMENTARIOS
//// Calificar Cuarto

//// Denunciar Comentario

//// Calcular Estrellas

//// Listar Comentario








/////////hace la validacion del token
exports.RevisarToken = (req , res , next) =>{
    const bearerHeader = req.body.accessToken;
    console.log(bearerHeader)
	console.log(req.body.accessToken)
	if(typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}