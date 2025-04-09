import mysql from 'mysql2';


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'BTL_CNPM'
})

export default connection;