const environment = process.env.DATABASE_URL ? "production" : "development";
const config = require("../knexfile")[environment];

const knex = require("knex")(config);

module.exports = knex;
