const mongoose = require('mongoose');

const HOST_DB = process.env.HOST_DB || 'localhost';
console.log("HOST_DB: ", HOST_DB);

mongoose.connect(`mongodb://${HOST_DB}:27017/cafe`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos conectada');

});
module.exports = mongoose;