require('dotenv').config()

module.exports = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: process.env.DB_PORT_POSTGRES,
        user: process.env.DB_USER_POSTGRES,
        // password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    migrations: {
        tableName: 'migrations'
    }
}