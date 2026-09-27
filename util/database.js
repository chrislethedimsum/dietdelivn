const mysql = require('mysql2');

const pool = mysql.createPool({

});

module.exports = pool.promise();
