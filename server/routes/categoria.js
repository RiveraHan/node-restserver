const express = require('express');
const { VerificacionToken, ValidacionAdminRole } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');

const app = express();

app.get('/categoria', VerificacionToken, (req, res) => {

    Categoria.find({}).sort('descripcion').populate('usuario', 'nombre email').exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });
    });
});

app.get('/categoria/:id', VerificacionToken, (req, res) => {


    const id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: { message: 'Categoria no encontrada' }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.post('/categoria', VerificacionToken, (req, res) => {

    const body = req.body;

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {
        if (err || !categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', VerificacionToken, (req, res) => {

    const id = req.params.id;
    const descripcion = req.body.descripcion;

    Categoria.findOneAndUpdate(id, { descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se encuentra la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [VerificacionToken, ValidacionAdminRole], (req, res) => {


    const id = req.params.id;

    Categoria.findOneAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se encuentra la categoria'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
});

module.exports = app;