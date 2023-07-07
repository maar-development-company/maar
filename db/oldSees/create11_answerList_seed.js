/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../11_answerList.json");

exports.seed = function (knex, Promise) {
  return knex("answerList")
    .del()
    .then(() => {
      return knex("answerList").insert(inputJSON);
    });
};