const express = require("express");
const router = express.Router();
const knex = require("./db");

router.get("/:municipalitiesname", async (req, res) => {
  console.log("該当地域に所属する世帯のアドレスのGETリクエスト受信");
  const municipalitiesName = req.params.municipalitiesname;
  // console.log(municipalitiesName);

  if (municipalitiesName) {
    const getMunicipalitiesId = async () => {
      return knex
        .select("id")
        .from("municipalitiesList")
        .where("municipalitiesName", municipalitiesName);
    };
    const municipalitiesIdArrObj = await getMunicipalitiesId();
    const municipalitiesId = municipalitiesIdArrObj[0].id;
    // console.log("IDを出力しますよ〜〜〜〜〜〜〜〜", municipalitiesId);

    const getEmailList = async () => {
      console.log("世帯リストのセレクト開始");
      return knex
        .select("householdMail")
        .from("householdList")
        .where("municipalitiesID", municipalitiesId);
    };

    const emailList = await getEmailList();
    // console.log("emailList: ", emailList);
    console.log("世帯リスト一覧の取得が完了しました。");

    res.status(200).send(emailList);
  } else {
    res.status(400).json({ error: "市町村のデータがありまへん。" });
  }
});

module.exports = router;
