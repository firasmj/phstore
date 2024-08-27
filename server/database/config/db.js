require("dotenv").config();
const mysql = require('mysql2');

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

// const db = mysql.createConnection({
//     localAddress: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// });
const db = mysql.createConnection(urlDB);

module.exports = db;
