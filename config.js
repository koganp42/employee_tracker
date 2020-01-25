const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT,
    password: process.env.DB_KEY,
    databaseName: process.env.DB_NAME
}