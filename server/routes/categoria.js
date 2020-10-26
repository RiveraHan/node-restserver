const express = require('express');
const { VerificacionToken, ValidacionAdminRole } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');

const router = express.Router();

router.get('/categoria', VerificacionToken, (req, res) => {

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

router.get('/categoria/:id', VerificacionToken, (req, res) => {


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

router.post('/categoria', VerificacionToken, (req, res) => {

    const body = req.body;
    const descripcion = body.descripcion;
    const regex = new RegExp(descripcion, 'i');
    Categoria.findOne({ descripcion: regex }, (err, categoriaDB) => {
        if (categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'La categoria ya existe'
                }
            });
        } else {

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
        }
    });
});

router.put('/categoria/:id', VerificacionToken, (req, res) => {

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

router.delete('/categoria/:id', [VerificacionToken, ValidacionAdminRole], (req, res) => {


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

module.exports = router;