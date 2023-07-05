const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const knex = require("./db"); // knex の設定を分離してインポート

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
  
        return "登録完了";
        // --------------------------------------------------------------------------------------
      } else {
        console.log("こっちはログイン");
  
        const checkmailAdressID = async () => {
          return knex
            .select("id")
            .from("householdList")
            .where("householdMail", postData.mailadress);
        };
        const MailAdressIDResult = await checkmailAdressID();
        console.log("MailAdressIDResult: ", MailAdressIDResult[0].id);
  
        // このあたりでハッシュ値をDBから取り出してcompareして比較
        const getDBPassID = async () => {
          return knex
            .select("householdPassID")
            .from("householdTable")
            .where("householdNameID", MailAdressIDResult[0].id);
        };
        const getDBPassIDResult = await getDBPassID();
        console.log("パスnameのID : ", getDBPassIDResult[0].householdPassID);
  
        const getDBPass = async () => {
          return knex
            .select("householdPass")
            .from("householdPassList")
            .where("id", getDBPassIDResult[0].householdPassID);
        };
        const getDBPassResult = await getDBPass();
        console.log("ハッシュパス : ", getDBPassResult[0].householdPass);
  
        const hashedPassword = getDBPassResult[0].householdPass;
  
        const passwordMatch = await bcrypt.compare(
          postData.password,
          hashedPassword
        );
  
        if (passwordMatch) {
          // パスワードが一致する場合の処理
          console.log("パスワードが一致しました");
          // ログイン成功の処理を行う
        } else {
          // パスワードが一致しない場合の処理
          console.log("パスワードが一致しません");
          // ログイン失敗の処理を行う
        }
  
        const checkPass = async () => {
          return knex
            .select("householdPass")
            .from("householdPassList")
            .where("id", getDBPassIDResult[0].householdPassID);
        };
        const checkPassResult = await checkPass();
        console.log("Password: ", checkPassResult);
        // ---------------------------------------------------------------------------
  
        // const checkPassID = async () => {
        //   return knex
        //     .select("id")
        //     .from("householdPassList")
        //     .where("householdPass", postData.password);
        // };
        // const PassIDResult = await checkPassID();
        // console.log("PassIDResult: ", PassIDResult);
  
        const checkLoginInfo = async () => {
          return knex
            .select("id")
            .from("householdTable")
            .where("householdNameID", MailAdressIDResult[0].id)
            .andWhere("householdPassID", getDBPassIDResult[0].householdPassID);
        };
        const checkLoginResult = await checkLoginInfo();
        console.log("checkLoginResult : ", checkLoginResult);
  
        if (checkLoginResult.length > 0) {
          console.log("checkLoginResult[0].id: ", checkLoginResult[0].id);
          const getRoleFunc = async () => {
            return knex
              .select(
                "householdList.roleFlag",
                "householdList.householdName",
                "householdList.householdTel",
                "householdList.householdMail",
                "householdList.householdAge",
                "householdList.municipalitiesID",
                "householdList.block1",
                "householdList.block2",
                "municipalitiesList.municipalitiesName"
              )
              .from("householdList")
              .join(
                "municipalitiesList",
                "householdList.municipalitiesID",
                "municipalitiesList.id"
              )
              .where("householdList.id", checkLoginResult[0].id);
          };
  
          const roleResult = await getRoleFunc();
          console.log("roleResult: ", roleResult);
  
          let role;
          if (roleResult.length > 0) {
            if (roleResult[0].roleFlag === "0") {
              role = 1;
            } else {
              role = 2;
            }
          } else {
            role = 0;
          }
          // ++++++++最終ログイン日時をDBに登録↓
          const loginTimestamp = postData.loginTimestamp;
          // dbにupdateを送って最終ログイン日時を更新
          const updateLoginTimestamp = () => {
            console.log(
              `ユーザーID${checkLoginResult[0].id}の最終ログイン日時を${loginTimestamp}に更新します`
            );
            return knex("householdList")
              .update("lastLoginTimestamp", loginTimestamp)
              .where("id", checkLoginResult[0].id);
          };
  
          await updateLoginTimestamp();
          // ++++++++最終ログイン日時をDBに登録↑
  
          const resultObj = {
            judge: role,
            name: roleResult[0].householdName,
            houseHoldNameID: checkLoginResult[0].id,
            tel: roleResult[0].householdTel,
            mail: roleResult[0].householdMail,
            age: roleResult[0].householdAge,
            municipalitiesID: roleResult[0].municipalitiesID,
            municipalitiesName: roleResult[0].municipalitiesName,
            blockName: roleResult[0].block1,
            groupNum: roleResult[0].block2,
          };
          return resultObj;
        }
      }
    };
  
    const postDataCheckResult = await postDataCheckFunc();
    console.log(postDataCheckResult);
  
    res.status(200).json(postDataCheckResult);
});

module.exports = router;