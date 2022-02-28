const db = require('../config/db')
const schema = 'category'

function get() {
    return db(schema)
}

function getById(id) {
    return db(schema).where({ id }).first()
}

function save(category) {
    return db(schema).insert(category)
}

function update(category, id) {
    return db(schema).update(category).where({ id })
}

module.exports = {
    get,
    getById,
    save,
    update,
}