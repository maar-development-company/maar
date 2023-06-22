/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../08_userIdList.json");

exports.seed = function (knex, Promise) {
  return knex("userIdList")
    .del()
    .then(() => {
      return knex("userIdList").insert(inputJSON);
    });
};