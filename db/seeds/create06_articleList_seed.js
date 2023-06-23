/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../06_articleList.json");

exports.seed = function (knex, Promise) {
  return knex("articleList")
    .del()
    .then(() => {
      return knex("articleList").insert(inputJSON);
    });
};