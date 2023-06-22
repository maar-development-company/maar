/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../09_userPassList.json");

exports.seed = function (knex, Promise) {
  return knex("userPassList")
    .del()
    .then(() => {
      return knex("userPassList").insert(inputJSON);
    });
};