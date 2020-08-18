require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// Todos los routes de la app
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos conectada');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', 3000);

})