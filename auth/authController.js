const User = require('./authDao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123';

exports.createUser = (req,res,next)=>{
    var opciones
    if (req.body.tipo=='1') {
        opciones=["crea_resi","ver","registrar_cuartos","calificar","quitar_comentario"]
    } else {
        opciones=["reservar","ver","calificar","quitar_comentarioById","denunciar_comentario"]
    }
    const newUser ={
        tipo : req.body.tipo,
        nombre:req.body.nombre,
        usuario:req.body.usuario,
        contra:bcrypt.hashSync(req.body.contra),
        opciones:opciones
    }
    User.create (newUser,(err,user)=>{
        if (err && err.code === 11000) {
            console.log(req.body);
        return res.status(409).send('usuario already exists'
        )};
        if (err) {
            console.log(req.body);
            return res.status(500).send('Server error asd '+ err
            )};
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({id: user.id},
            SECRET_KEY,{
                expiresIn : expiresIn
            });
            const dataUser = {
                tipo    : user.tipo,
                nombre  : user.nombre,
                usuario : user.usuario,
                opciones: user.opciones,
                accessToken:accessToken,
                expiresIn:expiresIn
            }
        //response
            res.send({dataUser});
    });
}
exports.LoginUser = (req , res , next)=>{
    const userData={
        usuario:req.body.usuario,
        contra:req.body.contra
    }
    User.findOne({
        usuario:userData.usuario},(err,user)=>{
        if (err) return res.status(500).send('Server error');
        if (!user){ 
            return res.status(409).send({message: 'Pucha man te equivocaste en algo'})
        }   else{
            const resultPassword = bcrypt.compareSync(userData.contra , user.contra);
            if (resultPassword) {

                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({id: user.id},SECRET_KEY,{expiresIn : expiresIn});

                const dataUser = {
                    tipo    : user.tipo,
                    nombre  : user.nombre,
                    usuario : user.usuario,
                    opciones: user.opciones,
                    accessToken:accessToken,
                    expiresIn:expiresIn
                }
                res.send({dataUser});
            }else{
                //la contra no fue correcta
                return res.status(409).send({message: 'Pucha man te equivocaste de nuevo'})
            }
        };
    })
}

