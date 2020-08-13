/**
 * Puerto
 */


process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Base de Datos
 */

let urlBD;

if (process.env.NODE_ENV === 'dev') urlBD = 'mongodb://localhost:27017/cafe';
else urlBD = 'mongodb+srv://riverahan:Mariobrosking21@cluster0.vz8od.mongodb.net/cafe?retryWrites=true&w=majority';

process.env.URLDB = urlBD;