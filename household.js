const express = require("express");
const router = express.Router();
const knex = require('./db'); // knexの設定を分離

// 世帯リスト（地域IDから取得）
router.get("/maar/householdList", async (req, res) => {
    console.log("世帯リストのGETリクエスト受信");
    // クエリから市町村を取得
    const municipalitiesID = req.query.municipalitiesID;
    console.log(municipalitiesID);
    // 市区町村データがあるか確認
    if (municipalitiesID) {
      console.log(`municipalitiesID: ${municipalitiesID}`);
  
      // 世帯リストを取得する関数
      const getHouseholdList = async () => {
        console.log("世帯リストのセレクト開始");
        return knex
          .select("*")
          .from("householdList")
          .where("municipalitiesID", municipalitiesID)
          .orderBy("id");
      };
  
      // 世帯リストを取得して応答として送信する
      const householdList = await getHouseholdList();
      console.log("householdList: ", householdList);
      console.log("世帯リスト一覧の取得が完了しました。");
  
      // 特定の町内会情報を取得する関数
      const getMunicipality = async () => {
        console.log("町内会情報のセレクト開始");
        return knex
          .select("*")
          .from("municipalitiesList")
          .where("id", municipalitiesID);
      };
  
      // 特定の町内会情報を取得して応答として送信する
      const municipalityInfo = await getMunicipality();
      console.log("municipalityInfo: ", municipalityInfo);
      console.log("町内会情報の取得が完了しました。");
  
      res.status(200).json([householdList, municipalityInfo]);
    } else {
      // 市区町村データがない時は、エラーを返す
      res.status(400).json({ error: "市区町村データがありません。" });
    }
});

module.exports = router;