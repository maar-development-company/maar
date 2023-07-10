const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const knex = require("./db"); // knex の設定を分離してインポート
const { select } = require("underscore");

// ログイン機能
router.post("/maar/login", async (req, res) => {
  console.log("ログイン情報をPOST受信");

  const postData = req.body;
  console.log("ログインのbodyチェック", postData);

  //ログイン情報の確認
  const postDataCheckFunc = async () => {
    // postDateのloginCategoryで分岐0:通常 1:新規登録
    if (postData.loginCategory === 1) {
      delete postData.loginCategory;
      delete postData.password;

      console.log("こっちは新規");

      const insertHouseHoldList = async () => {
        return knex("householdList")
          .insert(postData)
          .returning("id")
          .then((insertedIds) => {
            const insertedId = insertedIds[0].id;
            console.log("挿入されたレコードのID1:", insertedId);
            return insertedId;
          })
          .catch((error) => {
            console.error(error);
          });
      };
      const insertHouseHoldResult = await insertHouseHoldList();
      console.log("登録ID1", insertHouseHoldResult);

      const insertHouseHoldPassList = async () => {
        return knex("householdPassList")
          .insert({
            householdPass: postData.password,
          })
          .returning("id")
          .then((insertedIds) => {
            const insertedPassId = insertedIds[0].id;
            console.log("挿入されたレコードのID2:", insertedPassId);
            return insertedPassId;
          })
          .catch((error) => {
            console.error(error);
          });
      };
      const insertHouseHoldPassResult = await insertHouseHoldPassList();
      console.log("登録PassID", insertHouseHoldPassResult);

      const insertHouseHoldTable = async (
        insertHouseHoldResult,
        insertHouseHoldPassResult
      ) => {
        return knex("householdTable").insert({
          householdNameID: insertHouseHoldResult,
          householdPassID: insertHouseHoldPassResult,
        });
      };
      const insertHouseHoldTableResult = await insertHouseHoldTable(
        insertHouseHoldResult,
        insertHouseHoldPassResult
      );
      console.log("登録ID3", insertHouseHoldTableResult);

      const checkMName = async () => {
        return knex("municipalitiesList")
          .select("municipalitiesName")
          .where("id", postData.municipalitiesID);
      };
      const checkMNameResult = await checkMName();
      console.log("name", checkMNameResult);
      const aaa = checkMNameResult[0].municipalitiesName;
      console.log("qqqqq", checkMNameResult[0].municipalitiesName);
      return (resultObj = {
        judge: 1,
        name: postData.householdName,
        houseHoldNameID: insertHouseHoldResult,
        tel: postData.householdTel,
        mail: postData.householdMail,
        age: postData.householdAge,
        municipalitiesID: postData.municipalitiesID,
        municipalitiesName: aaa,
        blockName: postData.block1,
        groupNum: postData.block2,
      });
      // --------------------------------------------------------------------------------------
    } else if (postData.loginCategory === 0) {
      console.log("こっちはログイン");

      const checkmailAdID = async () => {
        return knex
          .select("*")
          .from("householdList")
          .where("householdMail", postData.mailadress);
      };
      const checkmailAdIDResult = await checkmailAdID();
      console.log("MailAdressIDResult1: ", checkmailAdIDResult);

      const checkmailAdressID = async () => {
        return knex
          .select("id")
          .from("householdList")
          .where("householdMail", postData.mailadress);
      };
      const MailAdressIDResult = await checkmailAdressID();
      console.log("MailAdressIDResult2:", MailAdressIDResult[0]);

      const checkmuniName = async () => {
        return knex
          .select("municipalitiesName")
          .from("municipalitiesList")
          .where("id", MailAdressIDResult[0].id);
      };
      const checkmuniNameResult = await checkmuniName();
      console.log("checkmuniNameResult: ", checkmuniNameResult);

      // このあたりでハッシュ値をDBから取り出してcompareして比較
      // const getDBPassID = async () => {
      //   return knex
      //     .select("householdPassID")
      //     .from("householdTable")
      //     .where("householdNameID", MailAdressIDResult[0].id);
      // };
      // const getDBPassIDResult = await getDBPassID();
      const getDBPassIDResult = 1;
      console.log("パスnameのID : 1");

      // console.log("パスnameのID : ", getDBPassIDResult[0].householdPassID);

      // const getDBPass = async () => {
      //   return knex
      //     .select("householdPass")
      //     .from("householdPassList")
      //     .where("id", getDBPassIDResult[0].householdPassID);
      // };
      // const getDBPassResult = await getDBPass();
      const getDBPassResult = 1;

      console.log("ハッシュパス : 1");

      // const hashedPassword = getDBPassResult[0].householdPass;

      // const passwordMatch = await bcrypt.compare(
      //   postData.password,
      //   hashedPassword
      // );

      // if (passwordMatch) {
      //   // パスワードが一致する場合の処理
      //   console.log("パスワードが一致しました");
      //   // ログイン成功の処理を行う
      // } else {
      //   // パスワードが一致しない場合の処理
      //   console.log("パスワードが一致しません");
      //   // ログイン失敗の処理を行う
      // }

      // const checkPass = async () => {
      //   return knex
      //     .select("householdPass")
      //     .from("householdPassList")
      //     .where("id", getDBPassIDResult[0].householdPassID);
      // };
      // const checkPassResult = await checkPass();
      // console.log("Password: ", checkPassResult);

      // const checkLoginInfo = async () => {
      //   return knex
      //     .select("id")
      //     .from("householdTable")
      //     .where("householdNameID", MailAdressIDResult[0].id)
      //     .andWhere("householdPassID", getDBPassIDResult[0].householdPassID);
      // };
      // const checkLoginResult = await checkLoginInfo();
      // console.log("checkLoginResult : ", checkLoginResult);

      const checkhID = async () => {
        return knex
          .select("roleFlag")
          .from("householdList")
          .where("householdMail", postData.mailadress);
      };
      const checkLoginResult = await checkhID();
      console.log("checkLoginResult : ", checkLoginResult);

      // if (checkLoginResult.length > 0) {
      //   console.log("checkLoginResult[0].id: ", checkLoginResult[0].roleFlag);
      //   const getRoleFunc = async () => {
      //     return knex
      //       .select(
      //         "householdList.roleFlag",
      //         "householdList.householdName",
      //         "householdList.householdTel",
      //         "householdList.householdMail",
      //         "householdList.householdAge",
      //         "householdList.municipalitiesID",
      //         "householdList.block1",
      //         "householdList.block2",
      //         "municipalitiesList.municipalitiesName"
      //       )
      //       .from("householdList")
      //       .join(
      //         "municipalitiesList",
      //         "householdList.municipalitiesID",
      //         "municipalitiesList.id"
      //       )
      //       .where("householdList.id", checkLoginResult[0].id);
      // };

      const roleResult = checkLoginResult[0].roleFlag;
      // const roleResult = await getRoleFunc();
      console.log("roleResult: ", roleResult);

      let role = roleResult !== undefined ? parseInt(roleResult) + 1 : 0;

      // ++++++++最終ログイン日時をDBに登録↓
      const loginTimestamp = "2023-07-10 00:38:05";
      // dbにupdateを送って最終ログイン日時を更新
      const updateLoginTimestamp = () => {
        console.log(
          `ユーザーID${postData.mailadress}の最終ログイン日時を${loginTimestamp}に更新します`
        );
        return knex("householdList")
          .update("lastLoginTimestamp", loginTimestamp)
          .where("householdMail", postData.mailadress);
      };

      await updateLoginTimestamp();
      // ++++++++最終ログイン日時をDBに登録↑
      console.log("Obj!!! ", checkmailAdIDResult);

      const resultObj = {
        judge: role,
        name: checkmailAdIDResult[0].householdName,
        houseHoldNameID: checkmailAdIDResult[0].id,
        tel: checkmailAdIDResult[0].householdTel,
        mail: checkmailAdIDResult[0].mailadress,
        age: checkmailAdIDResult[0].householdAge,
        municipalitiesID: checkmailAdIDResult[0].municipalitiesID,
        municipalitiesName: checkmuniNameResult[0].municipalitiesName,
        blockName: checkmailAdIDResult[0].block1,
        groupNum: checkmailAdIDResult[0].block2,
      };
      console.log("Obj!!!!!!! ", resultObj);
      return resultObj;
    } else {
      console.log("こっちはメアドチェック");
      const postData = req.body;
      console.log("ログインのbodyチェック", postData.mailadress);
      const checkAccountFuncBack = async () => {
        return knex("householdList")
          .select("id")
          .where("householdMail", postData.mailadress);
      };
      const result = await checkAccountFuncBack();
      console.log(result);
      const resultObj = {
        judge: result.length === 1 ? 1 : 0,
        name: "",
        houseHoldNameID: "",
        tel: "",
        mail: "",
        age: "",
        municipalitiesID: "",
        municipalitiesName: "",
        blockName: "",
        groupNum: "",
      };
      return resultObj;
    }
  };

  const postDataCheckResult = await postDataCheckFunc();
  console.log(postDataCheckResult);

  res.status(200).json(postDataCheckResult);
});

module.exports = router;
