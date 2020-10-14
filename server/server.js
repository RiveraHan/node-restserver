/**
 * 
 * @fileoverview Archivo main.
 * Cargamos los archivos de configuraciones(variables de entornos) y la conección y configuración de la base de datos.
 * @author Hanzell Rivera<hanzellrivera95@gmail.com>
 * 
 */

require('./config/config')
require('./config/database')

const express = require('express')
const app = express();
const bodyParser = require('body-parser'); //FIXME: Utilizar el parseo que incluye express en lugar del body-parser 
// TODO: Desintalar dependencia de body-parse
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../public')));

// Todos los routes de la app
app.use(require('./routes/index'));

app.listen(process.env.PORT, () => console.log('Escuchando el puerto: ', process.env.PORT));