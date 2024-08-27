var db = require('mysql2');
// import { Sequelize, DataTypes } from 'sequelize';

// const sequelize = new Sequelize('sqlite:memory:');
// const User = sequelize.define('User',{
//     username: DataTypes.STRING,
//     password: DataTypes.STRING,
//     email: DataTypes.STRING,
//     id: DataTypes.INTEGER
// });

var con = db.createConnection({
    localAddress: "localhost",
    user: "firas",
    password: "firas23",
    database: "db2"
});

con.connect(function(err){
    if(err) throw err;
    // var sql = 
    console.log('connected as id ' + con.threadId);
});

var sql1 = 'Select * From user';

con.query(sql, (err, rows, fields) => {
    if(err) throw err
    console.log('query successful ' + rows[0].username)
})

con.end();