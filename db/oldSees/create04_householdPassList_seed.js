/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../04_householdPassList.json");

exports.seed = function (knex, Promise) {
  return knex("householdPassList")
    .del()
    .then(() => {
      return knex("householdPassList").insert(inputJSON);
    });
};