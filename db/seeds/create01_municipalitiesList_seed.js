/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const inputJSON = require("../01_municipalities.json");

exports.seed = function (knex, Promise) {
  return knex("municipalitiesList")
    .del()
    .then(() => {
      return knex("municipalitiesList").insert(inputJSON);
    });
};