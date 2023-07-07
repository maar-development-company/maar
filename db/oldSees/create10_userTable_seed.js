/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../10_userTable.json");

exports.seed = function (knex, Promise) {
  return knex("userTable")
    .del()
    .then(() => {
      return knex("userTable").insert(inputJSON);
    });
};