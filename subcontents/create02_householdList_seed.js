/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../02_householdList.json");

exports.seed = function (knex, Promise) {
  return knex("householdList")
    .del()
    .then(() => {
      return knex("householdList").insert(inputJSON);
    });
};