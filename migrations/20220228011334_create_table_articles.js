/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('article', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('description', 1000).notNullable()
        table.string('imageUrl', 1000)
        table.binary('content').notNullable()
        table.integer('userId').references('id')
            .inTable('user').notNullable()
        table.integer('categoryId').references('id')
            .inTable('category').notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('article')
};
