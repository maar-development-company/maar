const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL || {
    host: "127.0.0.1",
    user: "user",
    password: "user",
    database: "maardb",
  },
});
const app = express();
const port = process.env.PORT || 8080;

const buildPath = path.join(__dirname, "./build");

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());

// ページ表示時に地域を返す
app.get("/muni", async (req, res) => {
  console.log("地域表示の為のget受信");
  const AllMunicipalitiesfunc = () => {
    return knex.select("*").from("municipalitiesList");
  };
  const AllMunicipalitiesObj = await AllMunicipalitiesfunc();
  console.log("getObj完了");
  res.status(200).json(AllMunicipalitiesObj);
});

// ログイン機能
app.post("/maar/login", async (req, res) => {
  console.log("ログイン情報をPOST受信");

  const postData = req.body;

  //ログイン情報の確認
  const postDataCheckFunc = async () => {
    const checkMunicipalitiesID = async () => {
      return knex
        .select("id")
        .from("municipalitiesList")
        .where("municipalitiesName", postData.municipalities);
    };
    const MunicipalitiesIDResult = await checkMunicipalitiesID();
    console.log("MunicipalitiesIDResult: ", MunicipalitiesIDResult);

    const checkmailAdressID = async () => {
      return knex
        .select("id")
        .from("householdList")
        .where("householdMail", postData.mailadress);
    };
    const MailAdressIDResult = await checkmailAdressID();
    console.log("MailAdressIDResult: ", MailAdressIDResult[0].id);

    const checkPassID = async () => {
      return knex
        .select("id")
        .from("householdPassList")
        .where("householdPass", postData.password);
    };
    const PassIDResult = await checkPassID();
    console.log("PassIDResult: ", PassIDResult);

    const checkLoginInfo = async () => {
      return knex
        .select("id")
        .from("householdTable")
        .where("householdNameID", MailAdressIDResult[0].id)
        .andWhere("householdPassID", PassIDResult[0].id);
    };
    const checkLoginResult = await checkLoginInfo();
    console.log("checkLoginResult : ", checkLoginResult);

    if (checkLoginResult.length > 0) {
      console.log("checkLoginResult[0].id: ", checkLoginResult[0].id);
      const getRoleFunc = async () => {
        return knex
          .select("roleFlag", "householdName")
          .from("householdList")
          .where("id", checkLoginResult[0].id);
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

      const resultObj = {
        judge: role,
        name: roleResult[0].householdName,
      };
      return resultObj;
    }
  };

  const postDataCheckResult = await postDataCheckFunc();
  console.log(postDataCheckResult);

  res.status(200).json(postDataCheckResult);
});

app.listen(port, () => {
  console.log(`Server is online on port: ${port}`);
});

// 記事の表示と登録
// 記事の表示（地域名から取得）
app.get("/maar/articlelist", async (req, res) => {
  console.log("記事リストのGETリクエスト受信");
  // クエリから市町村を取得
  const householdNameID = req.query.householdNameID;
  const municipalitiesName = decodeURIComponent(req.query.municipalitiesName);
  console.log(municipalitiesName);
  // 市区町村データがあるか確認
  if (municipalitiesName) {
    console.log(`Municipalities ID: ${householdNameID}`);
    console.log("municipalitiesName: ", municipalitiesName);

    // 特定の市町村の記事を取得する関数
    const getArticles = async (municipalitiesName, householdNameID) => {
      const getMunicipalitiesIDFunc = () => {
        return knex
          .select("id")
          .from("municipalitiesList")
          .where("municipalitiesName", municipalitiesName);
      };
      const getMunicipalitiesIDResultObj = await getMunicipalitiesIDFunc();
      console.log(getMunicipalitiesIDResultObj[0].id);

      return knex
        .select("*")
        .from("articleList")
        .where(
          "articleList.municipalitiesID2",
          getMunicipalitiesIDResultObj[0].id
        )
        .join("readFlagList", "articleList.id", "readFlagList.articleTitleID")
        .andWhere("readFlagList.householdNameID", householdNameID);
    };

    // 記事を取得して応答として送信する
    const articles = await getArticles(municipalitiesName, householdNameID);
    console.log("articles: ", articles);
    console.log("記事一覧の取得が完了しました。");
    res.status(200).json(articles);
  } else {
    // 市区町村データがない時は、エラーを返す
    res.status(400).json({ error: "市区町村データがありません。" });
  }
});

// 記事の表示（地域IDから取得）
app.get("/maar/articlelist", async (req, res) => {
  console.log("記事リストのGETリクエスト受信");
  // クエリから市町村を取得
  const municipalities = req.query.municipalities;
  const municipalitiesName = req.query.municipalitiesName;

  // 市区町村データがあるか確認
  if (municipalities) {
    console.log(`Municipalities ID: ${municipalities}`);
    console.log("municipalitiesName: ", municipalitiesName);

    // 特定の市町村の記事を取得する関数
    const getArticles = (municipalitiesName) => {
      return knex
        .select("*")
        .from("articleList")
        .join(
          "municipalitiesList",
          "articleList.municipalitiesID2",
          "municipalitiesList.id"
        )
        .where("municipalitiesID2", municipalities);
    };

    // 記事を取得して応答として送信する
    const articles = await getArticles(municipalities);
    console.log("articles: ", articles);
    console.log("記事一覧の取得が完了しました。");
    res.status(200).json(articles);
  } else {
    // 市区町村データがない時は、エラーを返す
    res.status(400).json({ error: "市区町村データがありません。" });
  }
});

// ##########テスト用コード
// MunicipalitiesIDResult:  [ { id: 2 } ]
// MailAdressIDResult:  [ { id: 1 } ]
// PassIDResult:  [ { id: 1 } ]
// {"mailadress":"aaaa@mail", "password":"ah29f9d8","municipalities":"meiwa"}
// 返す形
// {judge:0or1or2,name:▢▢,role: }
// ダミーコード
// {"mailadress":"aaaa@mail", "password":"ah29f9d8","municipalities":"meiwa"}
// ##########テスト用コード

// 記事の投稿
app.post("/maar/articlelist", async (req, res) => {
  console.log("記事の POST リクエスト受信");

  // ボディから記事データを取得
  const article = req.body;
  console.log(article);
  // リクエスト形式をチェック

  if (
    article &&
    article.articleTitle &&
    article.articleContent &&
    article.articleTimestamp &&
    article.municipalitiesName &&
    article.articleCategory
  ) {
    // console.log("if分の中");
    // console.log(JSON.stringify(article.municipalitiesName));
    const checkPOSTMunicipalitiesID = async () => {
      const result = await knex
        .select("id")
        .from("municipalitiesList")
        .where("municipalitiesName", article.municipalitiesName);
      console.log(result);
      return result[0].id;
    };

    const checkPOSTMunicipalitiesIDResult = await checkPOSTMunicipalitiesID();
    // console.log(
    //   "checkPOSTMunicipalitiesIDResult: ",
    //   checkPOSTMunicipalitiesIDResult
    // );

    article.municipalitiesID2 = checkPOSTMunicipalitiesIDResult;
    delete article.municipalitiesName;
    console.log("article: ", article);

    // 新しい記事を追加する関数
    const addArticle = (article) => {
      return knex("articleList").insert(article);
    };

    // 新しい記事を追加し応答として確認を送信
    await addArticle(article);
    console.log("新しい記事を追加");
    res.status(200).json({ message: "新しい記事を追加しました。" });
  } else {
    // 正常に投稿できない時は、エラーを返す
    res
      .status(400)
      .json({ error: "記事を追加できません。記載内容を確認してください。" });
  }
});

// {
//   "articleTitle":"お祭り",
//   "articleContent":"来たれ！上郷おいでん祭り",
//   "articleTimestamp":"2023-06-23 11:34:00",
//   "municipalitiesID2":1,
//   "articleCategory":"イベント"
// }

// ここから
// app.post("/maar/articlelist", async (req, res) => {
//   console.log("get受信");
//   const id = req.query.id;
//   console.log(id);
//   const getMyCard = (id) => {
//     return knex.select("*").from("cardPossession").where("userNameID", id);
//   };
//   const myCard = await getMyCard(id);
//   console.log("getObj完了");
//   res.status(200).json(myCard);
// });

// 記事を開いた時に既読を投稿する
// app.post("/maar/readarticle", async (req, res) => {
//   console.log("get受信");
//   const id = req.query.id;
//   console.log(id);
//   const getMyCard = (id) => {
//     return knex.select("*").from("cardPossession").where("userNameID", id);
//   };
//   const myCard = await getMyCard(id);
//   console.log("getObj完了");
//   res.status(200).json(myCard);
// });

// app.patch("/myCard", async (req, res) => {
//   console.log("patch受信");
//   const patchData = req.body;
//   console.log(patchData);
//   const patchDataFunc = async () => {
//     const updatedCardNum = patchData.cardNum;
//     await knex("cardPossession")
//       .where("userNameID", patchData.userNameID)
//       .andWhere("possessionCardID", patchData.possessionCardID)
//       .update({ cardNum: updatedCardNum });
//     return;
//   };
//   const executionPatch = await patchDataFunc();
//   res.sendStatus(200);
// });

// app.delete("/myCard", async (req, res) => {
//   console.log("delete受信");
//   const deleteData = req.body;
//   console.log(deleteData);
//   const deleteDataFunc = async () => {
//     await knex("cardPossession")
//       .where("possessionCardID", deleteData.possessionCardID)
//       .del();
//     return;
//   };
//   const executionDelete = await deleteDataFunc();
//   res.sendStatus(200);
// });
