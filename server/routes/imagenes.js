const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { VerificaTokenImg } = require('../middlewares/autenticacion');

router.get('/imagen/:tipo/:img', VerificaTokenImg, (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {

        res.sendFile(pathImagen);
    } else {

        const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

        res.sendFile(noImagePath);
    }
})

module.exports = router;