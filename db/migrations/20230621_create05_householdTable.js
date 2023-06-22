/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('householdTable', function(table) {
      table.increments("id").primary();
      table.integer('householdNameID');
      table.integer('householdPassID');
      table.foreign('householdNameID').references("id").inTable("householdList");
      table.foreign('householdPassID').references("id").inTable("householdPassList");
    });
};



/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('householdTable');
};
