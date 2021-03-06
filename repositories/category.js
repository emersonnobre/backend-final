const db = require('../config/db')
const schema = 'category'

function get() {
    return db(schema)
}

function getById(id) {
    return db(schema).where({ id }).first()
}

function getWhere(whereClause) {
    return db(schema.where(whereClause))
}

function save(category) {
    return db(schema).insert(category)
}

function update(category, id) {
    return db(schema).update(category).where({ id })
}

function remove(id) {
    return db(schema).where({ id }).del()
}

module.exports = {
    get,
    getById,
    getWhere,
    save,
    update,
    remove,
}