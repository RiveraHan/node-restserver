require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos conectada');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', 3000);

})