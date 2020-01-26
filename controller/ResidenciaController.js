const Residencia = require('../model/ResidenciaModel');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretkey123';

//  SECCION DE RESIDENCIA
//// Crear Residencia
exports.CrearResi = (req , res )=>{
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
exports.ActualizarResi = (req , res )=>{
    
    jwt.verify(req.token, SECRET_KEY, (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
            var dato = {$set:{nombre:req.body.residencia.nombre}}
            var id = req.params.iduni;
            console.log("id :"+id)
			Residencia.updateMany({universidad: id},dato,(err,doc)=>{
                if (err) {
                    res.send(err);
                } else {
                    res.send("id :"+id+"se guardo los datos " + req.body.residencia.nombre);    
                }
            });
		}
	});
}

//// Listar By Universidad
exports.ListarByUni = (req , res )=>{
    

    jwt.verify(req.token, SECRET_KEY, (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
            var id = req.params.id;
			Residencia.find({universidad: id},(err,doc)=>{
                if (err) {
                    res.send(err)
                } else {
                    console.log(id)
                    res.send(doc);
                }
                
            });
		}
	});
}

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
    console.log('ID:', req.params.iduni);
    const bearerHeader = req.body.accessToken;
	if(typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}