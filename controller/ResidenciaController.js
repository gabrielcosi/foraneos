const Residencia = require('../model/ResidenciaModel');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretkey123';
const cuartos = Residencia.piso;
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
exports.CrearCuartos = (req , res )=>{
    jwt.verify(req.token, SECRET_KEY, (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
            //contador
            
            var contador;
            Residencia.countDocuments({id:req.params.id,"cuartos.Nropiso":req.params.piso},(err,cantidad)=>{
                if (err) {
                    res.json("mensaje: " + "pues no funco la verdad man");
                }else{
                    var newCuarto={cuarto:req.body.cuarto};
                    ///Si Existe Ya El Piso
                    if (cantidad > 0) {
                        ////Guardar todo los datos anteriores
                        Residencia.find({ id:req.params.id},'cuartos', function (err, docs) {
                            if (err) {
                                res.sendStatus(403);
                            }
                            var cuartos_piso=docs[0].cuartos[0].cuartos;
                            console.log(cuartos_piso);
                            /*Residencia.findOneAndUpdate({id: req.params.id},
                                {$push:{cuartos:{Nropiso : req.params.piso , 
                                        cuartos:[{nrcuarto: req.body.cuarto.nrcuarto,
                                        amueblado: req.body.cuarto.amueblado,
                                        ocupado: req.body.cuarto.ocupado,
                                        costo: req.body.cuarto.costo,
                                        tipo: req.body.cuarto.tipo,
                                        costoreserva: req.body.cuarto.costoreserva},
                                        {nrcuarto: cuartos_piso[0].nrcuarto,
                                            amueblado: cuartos_piso[0].amueblado,
                                            ocupado: cuartos_piso[0].ocupado,
                                            costo: cuartos_piso[0].costo,
                                            tipo: cuartos_piso[0].tipo,
                                            costoreserva: cuartos_piso[0].costoreserva}
                                    ]}}},*/
                                Residencia.findOneAndUpdate({id: req.params.id},
                                    {$set:{cuartos:{Nropiso : req.params.piso , 
                                        cuartos:[{nrcuarto: req.body.cuarto.nrcuarto,
                                        amueblado: req.body.cuarto.amueblado,
                                        ocupado: req.body.cuarto.ocupado,
                                        costo: req.body.cuarto.costo,
                                        tipo: req.body.cuarto.tipo,
                                        costoreserva: req.body.cuarto.costoreserva},
                                    {nrcuarto: cuartos_piso[0].nrcuarto,
                                        amueblado: cuartos_piso[0].amueblado,
                                        ocupado: cuartos_piso[0].ocupado,
                                        costo: cuartos_piso[0].costo,
                                        tipo: cuartos_piso[0].tipo,
                                        costoreserva: cuartos_piso[0].costoreserva}]}}},
                                (err,doc)=>{
                                    if (err) {
                                        res.send({error:err});
                                    } else {
                                        res.send(doc.cuartos);
                                    }
                                });
                            //res.send(docs[0].cuartos[0]);
                        });
                        ////Cambiando
                    } 
                    ///Si Aun No Existe Ya El Piso
                    else {
                        
                        Residencia.findOneAndUpdate({id: req.params.id},
                            {$push:{cuartos:{Nropiso : req.params.piso , 
                                cuartos:{nrcuarto: req.body.cuarto.nrcuarto,
                                amueblado: req.body.cuarto.amueblado,
                                ocupado: req.body.cuarto.ocupado,
                                costo: req.body.cuarto.costo,
                                tipo: req.body.cuarto.tipo,
                                costoreserva: req.body.cuarto.costoreserva}}}},
                            (err,doc)=>{ 
                            if (err) {
                                res.send({error:err});
                            } else {
                                res.send({mensaje:"OK"});
                            }
                            
                        });
                    }
                }
                
            });
            
		}
	});
}
//// Actualizar Cuarto

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