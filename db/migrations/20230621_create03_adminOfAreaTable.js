/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('adminOfAreaTable', function(table) {
      table.increments("id").primary();
      table.integer('municipalitiesID');
      table.integer('householdNameID1');
      table.foreign('municipalitiesID').references("id").inTable("municipalitiesList");
      table.foreign("householdNameID1").references("id").inTable("householdList");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('adminOfAreaTable');
};
