/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('userTable', function(table) {
      table.increments("id").primary();
      table.integer('userNameID');
      table.integer('userPassID');
      table.foreign('userNameID').references("id").inTable("userIdList");
      table.foreign('userPassID').references("id").inTable("userPassList");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('userTable');
};
