const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./auth/authRouters');
const UniversidadRouters = require('./Rutas/UniversidadRouter')
const config = require('./config');





//configurando la aplicacion con express
const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
//configurando el ruteo

app.use(cors());
app.use('/api', router);
UniversidadRouters(router);
authRoutes(router);
router.get('/', (req, res) => {
  res.send('Hello from home');
});
app.use(router);
app.listen(3000);



//conectando la base de datos
mongoose.connect(config.cadenaConexion,function(err){
    if (err) {
        console.log('error al conectar con la BD')
    } else {
        console.log('conexion exitosa con la BD')
    }
})