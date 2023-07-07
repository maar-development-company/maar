/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../03_adminOfAreaTable.json");

exports.seed = function (knex, Promise) {
  return knex("adminOfAreaTable")
    .del()
    .then(() => {
      return knex("adminOfAreaTable").insert(inputJSON);
    });
};