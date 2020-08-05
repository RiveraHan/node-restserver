require('./config/config')

const express = require('express')
const app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('getUsuario')
})

app.post('/usuario', function(req, res) {
    const body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'

        });
    } else {

        res.json({ persona: body })
    }

})

app.put('/usuario/:id', function(req, res) {

    const id = req.params.id;
    res.json({
        id
    })
})

app.delete('/usuario', function(req, res) {
    res.json('deleteUsuario')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', 3000);

})