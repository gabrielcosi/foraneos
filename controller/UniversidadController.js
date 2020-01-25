const jwt = require('jsonwebtoken');
const universidades = require('../model/UniversidadModel')
const SECRET_KEY = 'secretkey123';
/////////////crear universidades

exports.CrearUni = (req,res) =>{
	jwt.verify(req.token, SECRET_KEY, (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
			universidades.create(req.body.universidad,(err,doc)=>{
				
				if (err && err.code === 11000) {return res.status(409).send('Universidad ya existe')};
				if (err) {return res.send("falta un campo")} ;
				res.send(doc);
			});
		}
	});
	
}

///////////listar universidades

exports.ListarUni = (req , res )=>{
    console.log(req)
    jwt.verify(req.token, SECRET_KEY, (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
			universidades.find().exec((err,docs)=>{
				res.send(docs)
			});
		}
	});
}
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