const db = require('../config/db')
const schema = 'article'

function get() {
    return db(schema)
}

function getById(id) {
    return db(schema).where({ id }).first()
}

function getWhere(whereClause) {
    return db(schema.where(whereClause))
}

function save(article) {
    return db(schema).insert(article)
}

function update(article, id) {
    return db(schema).update(article).where({ id })
}

module.exports = {
    get,
    getById,
    getWhere,
    save,
    update,
}