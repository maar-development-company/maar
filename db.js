const knex = require("knex")({
client: "pg",
connection: process.env.DATABASE_URL || {
    host: "127.0.0.1",
    user: "user",
    password: "user",
    database: "maardb",
},
});

module.exports = knex;