const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '103.151.239.67',
    user: 'admin',
    database: 'dietdeli-test',
    password: 'Haynhoko123@'
});

module.exports = pool.promise();