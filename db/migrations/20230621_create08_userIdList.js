/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('userIdList', function(table) {
      table.increments("id").primary();
      table.string('userName', 32);
      table.string('userTel',16);
      table.string('userMail',64);
      table.integer('userAge');
      table.integer('householdNameID');
      table.foreign('householdNameID').references("id").inTable("householdList");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('userIdList');
};
