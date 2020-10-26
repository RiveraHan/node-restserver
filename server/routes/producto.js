const express = require('express');
const router = express.Router();
const _ = require('underscore');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const { VerificacionToken } = require('../middlewares/autenticacion');

router.get('/productos', VerificacionToken, (req, res) => {

    const desde = req.query.desde || 0;
    Number(desde);

    Producto.find({ disponible: true }).populate('usuario', 'nombre email').populate('categoria', 'descripcion').skip(desde).limit(5).exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });
    });
});

router.get('/producto/:id', VerificacionToken, (req, res) => {

    const id = req.params.id;

    Producto.findById(id).populate('usuario', 'nombre email').populate('categoria', 'descripcion').exec((err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});

router.get('/productos/buscar/:termino', VerificacionToken, (req, res) => {

    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true }).populate('categoria', 'descripcion').exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        })
    })
})

router.post('/producto', VerificacionToken, (req, res) => {

    const body = req.body;

    const categoria = body.categoria;

    Categoria.findOne({ descripcion: categoria }, (err, categoriaDB) => {

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
                    message: 'categoria no existe'
                }
            });
        }

        const producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            categoria: categoriaDB._id,
            usuario: req.usuario._id
        });

        producto.save((err, producto) => {

            if (err || !producto) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            });
        });
    });

});


router.put('/producto/:id', VerificacionToken, (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'precioUni', 'categoria', 'disponible', 'descripcion', ]);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

router.delete('/producto/:id', VerificacionToken, (req, res) => {

    const id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });
    })

});

module.exports = router;