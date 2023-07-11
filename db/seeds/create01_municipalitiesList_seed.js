/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// const inputJSON = require("../01_municipalities.json");

exports.seed = async function (knex, Promise) {
  await knex("municipalitiesList")
    .del()
    .insert([
      {
        municipalitiesName: "1-DIG町内会",
        numberOfHouse: "200",
        blockNameArray: JSON.stringify(["A", "B", "C", "D"]),
        groupNumArray: JSON.stringify([
          [1, 2],
          [1, 2, 3],
          [1, 2, 3, 4],
          [1, 2, 3, 4, 5],
        ]),
        taxiNumber: "tel:000-1034-5678",
      },
      {
        municipalitiesName: "2-BTC町内会",
        numberOfHouse: "200",
        blockNameArray: JSON.stringify(["A", "B", "C", "D"]),
        groupNumArray: JSON.stringify([
          [1, 2],
          [1, 2, 3],
          [1, 2, 3, 4],
          [1, 2, 3, 4, 5],
        ]),
      },
      {
        municipalitiesName: "堤自治区",
        numberOfHouse: "80",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-3034-5678",
      },
      {
        municipalitiesName: "挙母町自治区",
        numberOfHouse: "70",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
        ]),
        taxiNumber: "tel:000-4034-5678",
      },
      {
        municipalitiesName: "前山町自治区",
        numberOfHouse: "60",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-5034-5678",
      },
      {
        municipalitiesName: "新田町自治区",
        numberOfHouse: "50",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-6034-5678",
      },
      {
        municipalitiesName: "東山町自治区",
        numberOfHouse: "55",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-7034-5678",
      },
      {
        municipalitiesName: "明石町自治区",
        numberOfHouse: "60",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-8034-5678",
      },
      {
        municipalitiesName: "富士見町自治区",
        numberOfHouse: "65",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-9034-5678",
      },
      {
        municipalitiesName: "宮本町自治区",
        numberOfHouse: "70",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1034-5678",
      },
      {
        municipalitiesName: "中野町自治区",
        numberOfHouse: "75",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1134-5678",
      },
      {
        municipalitiesName: "八幡町自治区",
        numberOfHouse: "80",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1234-5678",
      },
      {
        municipalitiesName: "桜木町自治区",
        numberOfHouse: "85",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1334-5678",
      },
      {
        municipalitiesName: "高崎町自治区",
        numberOfHouse: "90",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1434-5678",
      },
      {
        municipalitiesName: "浜松町自治区",
        numberOfHouse: "95",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1534-5678",
      },
      {
        municipalitiesName: "上野町自治区",
        numberOfHouse: "100",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1634-5678",
      },
      {
        municipalitiesName: "下町町自治区",
        numberOfHouse: "105",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1734-5678",
      },
      {
        municipalitiesName: "渋谷町自治区",
        numberOfHouse: "110",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1834-5678",
      },
      {
        municipalitiesName: "新宿町自治区",
        numberOfHouse: "115",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-1934-5678",
      },
      {
        municipalitiesName: "吉祥寺町自治区",
        numberOfHouse: "120",
        blockNameArray: JSON.stringify(["姫島", "宮前", "市場", "会下"]),
        groupNumArray: JSON.stringify([
          [1, 2, 3, 4, 5],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4],
        ]),
        taxiNumber: "tel:000-2134-5678",
      },
    ]);
};
