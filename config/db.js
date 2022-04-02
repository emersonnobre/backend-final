const config = require('../knexfile')
let knex = null

try {
    knex = require('knex')(config)
} catch(err) {
    console.log(`ERRO AO CONECTAR NO BANCO DE DADOS!\n${err}`)
}

module.exports = knex