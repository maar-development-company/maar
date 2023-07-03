/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("householdList", function (table) {
		table.increments("id").primary();
		table.string("householdName", 32);
		table.string("householdTel", 16);
		table.string("householdMail", 64);
		table.integer("householdAge");
		table.integer("familySize");
		table.string("roleFlag", 8);
		table.string("block1", 32);
		table.string("block2", 32);
		table.string("block3", 32);
		table.integer("municipalitiesID");
		table
			.foreign("municipalitiesID")
			.references("id")
			.inTable("municipalitiesList");
		table.timestamp("lastLoginTimestamp");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("householdList");
};
