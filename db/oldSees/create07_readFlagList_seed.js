/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../07_readFlagList.json");

exports.seed = function (knex, Promise) {
  return knex("readFlagList")
    .del()
    .then(() => {
      return knex("readFlagList").insert(inputJSON);
    });
};