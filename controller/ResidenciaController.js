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
            Residencia.countDocuments({id:req.params.id,"cuartos.Nropiso":req.params.piso},(err,cantidad)=>{
                if (err) {
                    res.json("mensaje: " + "pues no funco la verdad man");
                }else{
                    var newCuarto={cuarto:req.body.cuarto};
                    ///Si Existe Ya El Piso Se Agrega Nomas
                    if (cantidad > 0) {
                        ////Guardar todo los datos anteriores
                        Residencia.find({ id:req.params.id},'cuartos', function (err, docs) {
                            if (err) {
                                res.sendStatus(403);
                            }
                           otrospisos =docs[0].cuartos
                           //Agregamos el Nuevo Cuarto al Array Previo
                            for (let index = 0; index < otrospisos.length; index++) {
                                if (otrospisos[index].Nropiso==req.params.piso) {
                                    console.log(otrospisos[index])
                                    otrospisos[index].cuartos.push(newCuarto.cuarto)
                                }
                            }
                                Residencia.findOneAndUpdate({id: req.params.id},
                                    {$set:{cuartos:otrospisos}},
                                (err,doc)=>{
                                    if (err) {
                                        res.send({error:err});
                                    } else {
                                        res.send({Mesaje:"OK"});
                                    }
                                });
                        });
                        ////Cambiando
                    } 
                    ///Si Aun No Existe Ya El Piso Se Crea El Piso
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
                                res.send({Mesaje:"OK"});
                            }
                            
                        });
                    }
                }
                
            });
            
		}
	});
}
//// Eliminar Cuarto
exports.EliminarCuartos = (req, res) =>{
    jwt.verify(req.token, SECRET_KEY, (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
            ////Guardar todo los datos anteriores
            Residencia.find({ id:req.params.id},'cuartos', function (err, docs) {
                if (err) {
                    res.sendStatus(403);
                }
                otrospisos =docs[0].cuartos;
                var encontrado = false
                //Agregamos el Nuevo Cuarto al Array Previo
                for (let index = 0; index < otrospisos.length; index++) {
                    if (otrospisos[index].Nropiso==req.params.piso) {
                        for (let i = 0; i < (otrospisos[index].cuartos).length; i++) {
                            //console.log(otrospisos[index])
                            if (otrospisos[index].cuartos[i].nrcuarto==req.params.cuarto) {
                                encontrado = true;
                                //console.log(otrospisos[index].cuartos[i]+" "+i)
                                (otrospisos[index].cuartos).splice(i, 1);
                                console.log(otrospisos[index].cuartos)
                                //otrospisos[index].cuartos
                            }
                        }
                    }
                }
                if (encontrado) {
                    Residencia.findOneAndUpdate({id:req.params.id},
                    {$set:{cuartos:otrospisos}},
                    (err,doc)=>{
                        if (err) {
                            res.send({error:err});
                        } else {
                            res.send({Mesaje:"OK"});
                        }
                    });
                }else{
                    res.send({Mesaje:"no se a encontrado"});
                }
            });
		}
	});
}
//// Actualizar Cuarto

//// cambiar el estado Ocupado/Disponible

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