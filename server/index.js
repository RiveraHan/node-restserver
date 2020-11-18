/**
 * 
 * @fileoverview Archivo main.
 * @author Hanzell Rivera<hanzellrivera95@gmail.com>
 * 
 */

// Cargamos los archivos de configuraciones(variables de entornos) y la conección y configuración de la base de datos.
require('./config/config')
require('./config/database')

const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.resolve(__dirname, '../public')));

// Todos los routes de la app
app.use(require('./routes/index'));

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`HOST_DB: `, process.env.HOST_DB);
    console.log(`Corriendo en:${process.env.HOST}:${process.env.PORT}`);
});