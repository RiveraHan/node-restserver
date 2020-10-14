/**
 * Definimos las varibales de entorno
 */

/**
 * Puerto
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Vencimento Token
 */

process.env.CADUCIDAD_TOKEN = '24h';

/**
 * SEED  del token
 */

process.env.SEED = process.env.SEED || 'desarrollo';

/**
 * Base de Datos
 */

let urlBD;

process.env.NODE_ENV === 'dev' ? urlBD = 'mongodb://localhost:27017/cafe' : urlBD = process.env.MONGO_URI;
process.env.URLDB = urlBD;

/**
 * Google Client ID
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '836785229845-9ps66fae4vmt423rs99f03jnr2ugp6jf.apps.googleusercontent.com';