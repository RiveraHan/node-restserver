const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');
const producto = require('../models/producto');
const { VerificacionToken } = require('../middlewares/autenticacion');


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', VerificacionToken, (req, res) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    // Valida tipo
    const tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }

    const data = req.files.archivo;
    const nombreCortado = data.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo
    // 183912kuasidauso-123.jpg
    const nombreArchivo = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;


    data.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo, tipo);
                break;

            case 'productos':
                imagenProducto(id, res, nombreArchivo, tipo);
                break;
        }

    });

});

function imagenUsuario(id, res, nombreArchivo, tipo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borrarArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borrarArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, tipo)

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
            });

        });


    });
}

function imagenProducto(id, res, nombreArchivo, tipo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borrarArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, tipo);
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del producto no es existe'
                }
            });
        }

        borrarArchivo(productoDB.img, tipo)

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoImg) => {
            if (err) res.status(500).json({ ok: false, err });

            res.json({
                ok: true,
                producto: productoImg
            });
        });
    });
}

function borrarArchivo(nombreImagen, tipo) {

    const pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);
}

module.exports = app;