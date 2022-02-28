const db = require('../config/db')
const schema = 'user'

function get() {
    return db(schema)
}

function getById(id) {
    return db(schema).where({ id }).first()
}

function getByEmail(userEmail) {
    return db(schema).where({ email: userEmail }).first()
}

function save(user) {
    return db(schema).insert(user)
}

function update(user, id) {
    return db(schema).update(user).where({ id })
}


module.exports = {
    get,
    getById,
    getByEmail,
    save,
    update,
}