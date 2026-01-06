const mysql = require('mysql2/promise');

let config = {
    port: 3306,
    user: 'root',
    password: 'qwer1234@',
    database: 'invest_dev',
    connectionLimit: 30,
};

const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit,
});

module.exports = pool;