/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('municipalitiesList', function(table) {
      table.increments("id").primary();
      table.string('municipalitiesName', 32);
      table.integer('numberOfHouse');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('municipalitiesList');
};
