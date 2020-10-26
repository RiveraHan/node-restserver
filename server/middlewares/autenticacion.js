const jwt = require('jsonwebtoken');

/**
 * Verificacion del token
 */

const VerificacionToken = (req, res, next) => {

    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    })


};

/**
 * Verificacion de AdminRole
 */

const ValidacionAdminRole = (req, res, next) => {

    const usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es admin'
            }
        });
    }

}

/**
 * Verifica token imagen
 */

const VerificaTokenImg = (req, res, next) => {

    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    })
}

module.exports = { VerificacionToken, ValidacionAdminRole, VerificaTokenImg };