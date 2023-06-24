/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('readFlagList', function(table) {
      table.increments("id").primary();
      table.integer('articleTitleID');
      table.integer('householdNameID');
      table.string('readFlag', 8);
      table.timestamp('readTimestamp');
      table.foreign('articleTitleID').references("id").inTable("articleList");
      table.foreign('householdNameID').references("id").inTable("householdList");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('readFlagList');
};
