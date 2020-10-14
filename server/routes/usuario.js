const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { VerificacionToken, ValidacionAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', VerificacionToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let pagina = req.query.pagina || 5;
    pagina = Number(pagina);

    Usuario.find({ estado: true }, 'nombre email role estado google img').skip(desde).limit(pagina).exec((err, usuarios) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.countDocuments({ estado: true }, (err, conteo) => {

            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            });
        })



    });
});

app.post('/usuario', [VerificacionToken, ValidacionAdminRole], (req, res) => {
    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})

app.put('/usuario/:id', [VerificacionToken, ValidacionAdminRole], (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['email', 'nombre', 'password', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [VerificacionToken, ValidacionAdminRole], (req, res) => {

    const id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    const cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuarios: usuarioBorrado
        });
    });

});

module.exports = app;