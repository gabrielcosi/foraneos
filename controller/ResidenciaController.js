const Residencia = require('../model/ResidenciaModel');
const User = require('../auth/authDao');
const jwt = require('jsonwebtoken');
const cuartos = Residencia.piso;
//  SECCION DE RESIDENCIA
//// Crear Residencia
exports.CrearResi = (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Residencia.create(req.body.residencia, (err, doc) => {
        console.log(req.body.residencia);
        if (err && err.code === 11000) {
          return res.status(409).send(err);
        }
        if (err) {
          return res.send('falta un campo');
        }
        res.send(doc);
      });
    }
  });
};
//// Actualizar Residencia
exports.ActualizarResi = (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      var dato = { $set: { nombre: req.body.residencia.nombre } };
      var id = req.params.iduni;
      console.log('id :' + id);
      Residencia.updateMany({ universidad: id }, dato, (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.send(
            'id :' + id + 'se guardo los datos ' + req.body.residencia.nombre
          );
        }
      });
    }
  });
};

//// Listar By Universidad
exports.ListarByUni = async (req, res) => {
  try {
    var cerca = req.params.cerca;
    var coordenada = req.params.coordenadas;
    // var lat1=coordenadas.latitud;
    //var lon1=coordenadas.longitud;
    const residencias = await Residencia.find({ universidad: req.params.id });
    /*var residenciasordenadas=[]
        //no lo eh comprobado del todo si funciona el algoritmo
        var kilometro = getKilometros(-11.9890522,-76.8396917,-11.9877445,-76.838319);
        console.log(kilometro*1000);
        if (cerca="usuario") {
            for (let index = 0; index < residencias.length; index++) {
                if (con) {
                    residenciasordenadas.push(residencias[index])
                }
            }
        } else {
            for (let index = 0; index < residencias.length; index++) {
                residenciasordenadas.push(residencias[index])
            }
        }*/
    res.send(residencias);
  } catch (error) {
    res.send(error);
  }
};
function getKilometros(lat1, lon1, lat2, lon2) {
  rad = function(x) {
    return (x * Math.PI) / 180;
  };
  var R = 6378.137; //Radio de la tierra en km
  var dLat = rad(lat2 - lat1);
  var dLong = rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toFixed(3); //Retorna tres decimales
}
//// Filtrador

//  SECCION DE CUARTOS
//// Crear Cuartos
exports.CrearCuartos = async (req, res) => {
  try {
    var funciono = false;
    await jwt.verify(req.token, process.env.SECRET_KEY);
    const cantidad = await Residencia.countDocuments({
      id: req.params.id,
      'cuartos.Nropiso': req.params.piso
    });
    var newCuarto = { cuarto: req.body.cuarto };
    ///Si Existe Ya El Piso Se Agrega Nomas
    if (cantidad > 0) {
      ////Guardar todo los datos anteriores
      const residencia = await Residencia.find(
        { id: req.params.id },
        'cuartos'
      );
      otrospisos = residencia[0].cuartos;
      //Agregamos el Nuevo Cuarto al Array Previo
      for (let index = 0; index < otrospisos.length; index++) {
        if (otrospisos[index].Nropiso == req.params.piso) {
          otrospisos[index].cuartos.push(newCuarto.cuarto);
          funciono = true;
          break;
        }
      }
      await Residencia.findOneAndUpdate(
        { id: req.params.id },
        { $set: { cuartos: otrospisos } }
      );
      ////Cambiando
    }
    ///Si Aun No Existe Ya El Piso Se Crea El Piso
    else {
      await Residencia.findOneAndUpdate(
        { id: req.params.id },
        {
          $push: {
            cuartos: {
              Nropiso: req.params.piso,
              cuartos: {
                nrcuarto: req.body.cuarto.nrcuarto,
                amueblado: req.body.cuarto.amueblado,
                ocupado: req.body.cuarto.ocupado,
                costo: req.body.cuarto.costo,
                tipo: req.body.cuarto.tipo,
                costoreserva: req.body.cuarto.costoreserva
              }
            }
          }
        }
      );
      funciono = true;
    }
    if (funciono) {
      res.send({ Mensaje: 'Ok' });
    } else {
      res.send({ Mensaje: 'NoFound' });
    }
  } catch (error) {
    res.send(error);
  }
};
//// Eliminar Cuarto
exports.EliminarCuartos = async (req, res) => {
  await jwt.verify(req.token, process.env.SECRET_KEY);
  try {
    /// buscamos la residencia
    const residencia = await Residencia.find({ id: req.params.id }, 'cuartos');
    otrospisos = residencia[0].cuartos;
    var encontrado = false;
    ///buscamos el piso donde se desea eliminar el cuarto
    for (let index = 0; index < otrospisos.length; index++) {
      if (otrospisos[index].Nropiso == req.params.piso) {
        ///buscamos el cuarto que se desa eliminar
        for (let i = 0; i < otrospisos[index].cuartos.length; i++) {
          if (otrospisos[index].cuartos[i].nrcuarto == req.params.cuarto) {
            ////si el cuarto es el ultimo de su array borramos todo el piso
            if (otrospisos[index].cuartos.length == 1) {
              encontrado = true;
              otrospisos.splice(index, 1);
              /// reordenamos los pisos para que no se salteeen
              //ejemplo [piso 1,piso 3]
              for (let cont = 0; cont < otrospisos.length; cont++) {
                // se organizara [piso 1,piso 3-1] = [piso 1,piso 2]
                if (otrospisos[cont].Nropiso > req.params.piso) {
                  otrospisos[cont].Nropiso = otrospisos[cont].Nropiso - 1;
                }
              }
              break;
            }
            ////si el cuarto no es el ultimo de su array
            else {
              // simplemento eliminamos el cuarto y listo
              encontrado = true;
              otrospisos[index].cuartos.splice(i, 1);
              console.log(otrospisos[index].cuartos);
              break;
            }
          }
        }
      }
    }
    /// si se enconro
    if (encontrado) {
      // guardamos el array reordenado
      Residencia.findOneAndUpdate(
        { id: req.params.id },
        { $set: { cuartos: otrospisos } },
        (err, doc) => {
          if (err) {
            res.send({ error: err });
          } else {
            res.send({ Mesaje: 'OK' });
          }
        }
      );
    }
    /// mandamos un mensaje de que no es valido el cuarto
    else {
      res.send({ Mesaje: 'NotFound' });
    }
  } catch (error) {
    res.send(error);
  }
};
//// Actualizar Cuarto
exports.ActualizaCuarto = async (req, res) => {
  try {
    await jwt.verify(req.token, process.env.SECRET_KEY);
    const residencia = await Residencia.find({ id: req.params.id }, 'cuartos');
    var newCuarto = { cuarto: req.body.cuarto };
    var encontrado = false;
    var otrospisos = residencia[0].cuartos;
    //Agregamos el Nuevo Cuarto al Array Previo
    for (let index = 0; index < otrospisos.length; index++) {
      if (otrospisos[index].Nropiso == req.params.piso) {
        for (let i = 0; i < otrospisos[index].cuartos.length; i++) {
          if (otrospisos[index].cuartos[i].nrcuarto == req.params.cuarto) {
            encontrado = true;
            otrospisos[index].cuartos[i] = newCuarto.cuarto;
            break;
          }
        }
      }
    }
    await Residencia.findOneAndUpdate(
      { id: req.params.id },
      { $set: { cuartos: otrospisos } }
    );
    if (encontrado) {
      res.send((Mensaje = 'okay'));
    } else {
      res.send((Mensaje = 'NotFound'));
    }
  } catch (error) {
    res.send(error);
  }
};
//// cambiar el estado Ocupado/Disponible
exports.CambiarEstado = async (req, res) => {
  try {
    await jwt.verify(req.token, process.env.SECRET_KEY);
    const residencia = await Residencia.find({ id: req.params.id }, 'cuartos');
    var nrcuarto = req.params.cuarto;
    var encontrado = false;
    var otrospisos = residencia[0].cuartos;
    console.log('hola');
    //Agregamos el Nuevo Cuarto al Array Previo
    for (let index = 0; index < otrospisos.length; index++) {
      if (otrospisos[index].Nropiso == req.params.piso) {
        for (let i = 0; i < otrospisos[index].cuartos.length; i++) {
          if (otrospisos[index].cuartos[i].nrcuarto == nrcuarto) {
            console.log(otrospisos[index].cuartos[i].ocupado);
            encontrado = true;
            if (otrospisos[index].cuartos[i].ocupado == false) {
              otrospisos[index].cuartos[i].ocupado = true;
              break;
            } else {
              otrospisos[index].cuartos[i].ocupado = false;
            }
          }
        }
      }
    }
    await Residencia.findOneAndUpdate(
      { id: req.params.id },
      { $set: { cuartos: otrospisos } }
    );
    if (encontrado) {
      res.send((Mensaje = 'okay'));
    } else {
      res.send((Mensaje = 'NotFound'));
    }
  } catch (error) {
    res.send(error);
  }
};
//// Encontrar Cuarto By Residencia

//// Listar Cuartos
exports.ListarCuartos;

//  SECCION COMENTARIOS
//// Calificar Cuarto

//// Denunciar Comentario

//// Calcular Estrellas

//// Listar Comentario

/////////hace la validacion del token
exports.RevisarToken = (req, res, next) => {
  const bearerHeader = req.body.accessToken;
  if (typeof bearerHeader !== 'undefined') {
    const metodo = req.path.split('/')[1];
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};
