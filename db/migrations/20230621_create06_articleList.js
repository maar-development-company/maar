/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("articleList", function (table) {
		table.increments("id").primary();
		table.string("articleTitle", 256);
		table.string("articleContent");
		table.timestamp("articleTimestamp");
		table.string("articleCategory", 128);
		table.string("fileSavePath");
		table.integer("municipalitiesID2");
		table
			.foreign("municipalitiesID2")
			.references("id")
			.inTable("municipalitiesList");
		table.string("userReadInfo", 10000);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("articleList");
};
