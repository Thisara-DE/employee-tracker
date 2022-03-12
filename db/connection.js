// Connect to the DB
require('dotenv').config();
const mysql = require('mysql2');

// DB configuration
const dbConfig = {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
}

const db = mysql.createConnection(dbConfig,
    console.log(`Connected to the ${process.env.DB_NAME} database.`));

module.exports = db;
