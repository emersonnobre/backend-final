const db = require('../config/db')
const schema = 'article'

function getCount() {
    return db(schema).count('id').first()
}

function getWithPagination(page, limit) {
    return db(schema)
        .select('id', 'name', 'description')
        .limit(limit).offset(page * limit - limit) 
}

function getByCategories(ids, page, limit) {
    return db({a: schema, u: 'user'})
        .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
        .limit(limit).offset(page * limit - limit)
        .whereRaw('?? = ??', ['u.id', 'a.userId'])
        .whereIn('categoryId', ids)
        .orderBy('a.id', 'desc')
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

function remove(id) {
    return db(schema).where({ id }).del()
}

module.exports = {
    getCount,
    getWithPagination,
    getById,
    getWhere,
    getByCategories,
    save,
    update,
    remove,
}