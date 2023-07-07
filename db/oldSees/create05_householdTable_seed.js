/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../05_householdTable.json");

exports.seed = function (knex, Promise) {
  return knex("householdTable")
    .del()
    .then(() => {
      return knex("householdTable").insert(inputJSON);
    });
};