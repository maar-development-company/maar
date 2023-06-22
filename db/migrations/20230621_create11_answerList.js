/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('answerList', function(table) {
      table.increments("id").primary();
      table.integer('articleTitleID');
      table.integer('selectAnswerNo');
      table.string('answerComment',1024);
      table.integer('householdNameID1');
      table.integer('userNameID');
      table.foreign('articleTitleID').references("id").inTable("articleList");
      table.foreign('householdNameID1').references("id").inTable("householdList");
      table.foreign('userNameID').references("id").inTable("userIdList");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('answerList');
};
