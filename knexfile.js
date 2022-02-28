require('dotenv').config()

module.exports = {
    client: 'mssql',
    connection: {
        host: '127.0.0.1',
        port: 1433,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    migrations: {
        tableName: 'migrations'
    }
}