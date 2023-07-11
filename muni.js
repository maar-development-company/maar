const express = require("express");
const router = express.Router();
const knex = require("./db"); // knex の設定を分離してインポート

// ページ表示時に地域を返す
router.get("/muni", async (req, res) => {
  console.log("地域表示の為のget受信");
  const AllMunicipalitiesfunc = () => {
    return knex.select("*").from("municipalitiesList");
  };
  const AllMunicipalitiesObj = await AllMunicipalitiesfunc();
  console.log("getObj完了");
  res.status(200).json(AllMunicipalitiesObj);
});

// 組織構造の登録
router.post("/muni", async (req, res) => {
  const postData = req.body;
  // console.log(postData);
  postData.municipalitiesID = postData.municipalitiesID.toString();

  // groupNumArrayの各要素を対象にmap関数を用いて新たな配列を作成
  postData.groupNumArray = postData.groupNumArray.map((num) =>
    Array.from({ length: num }, (_, i) => i + 1)
  );
  // console.log("postData.groupNumArray: ", postData.groupNumArray);
  // console.log("postData", postData);
  try {
    await knex("municipalitiesList")
      .where("id", postData.municipalitiesID)
      .update({
        blockNameArray: JSON.stringify(postData.blockNameArray),
        groupNumArray: JSON.stringify(postData.groupNumArray),
      });

    res.status(200).send("組織情報登録完了");
  } catch (err) {
    console.error(err);
    res.status(400).send("サーバーエラー");
  }
});

module.exports = router;
