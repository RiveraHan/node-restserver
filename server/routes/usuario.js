const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { VerificacionToken, ValidacionAdminRole } = require('../middlewares/autenticacion');

router.get('/usuarios', VerificacionToken, (req, res) => {

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

router.post('/usuario', [VerificacionToken, ValidacionAdminRole], (req, res) => {
    const body = req.body;

    if (body.password.length >= 6) {

        const usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        usuario.save({ runValidators: true }, (err, usuarioDB) => {
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
    } else {

        res.status(400).json({ ok: false, message: ('La contraseña debe ser mínimo de 6 caracteres') });
    }


})

router.put('/usuario/:id', [VerificacionToken, ValidacionAdminRole], (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['email', 'nombre', 'img', 'role', 'estado']);

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

router.delete('/usuario/:id', [VerificacionToken, ValidacionAdminRole], (req, res) => {

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

module.exports = router;