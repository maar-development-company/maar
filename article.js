const express = require("express");
const router = express.Router();
const knex = require("./db"); // knexの設定を分離

// 記事の表示と登録
// 記事の表示（地域名から取得）
router.get("/maar/articlelist", async (req, res) => {
  console.log("記事リストのGETリクエスト受信");
  // クエリから市町村を取得
  const householdNameID = req.query.householdNameID;
  const municipalitiesName = decodeURIComponent(req.query.municipalitiesName);
  // console.log(municipalitiesName);
  // 市区町村データがあるか確認
  if (municipalitiesName) {
    // console.log(`Municipalities ID: ${householdNameID}`);
    // console.log("municipalitiesName: ", municipalitiesName);

    // 特定の市町村の記事を取得する関数
    const getArticles = async (municipalitiesName, householdNameID) => {
      const getMunicipalitiesIDFunc = () => {
        return knex
          .select("id")
          .from("municipalitiesList")
          .where("municipalitiesName", municipalitiesName);
      };
      const getMunicipalitiesIDResultObj = await getMunicipalitiesIDFunc();
      // console.log(getMunicipalitiesIDResultObj[0].id);
      console.log("1つ目のget");
      return knex
        .select("*")
        .from("articleList")
        .where(
          "articleList.municipalitiesID2",
          getMunicipalitiesIDResultObj[0].id
        )
        .orderBy("id", "desc");
      // .join("readFlagList", "articleList.id", "readFlagList.articleTitleID")
      // .andWhere("readFlagList.householdNameID", householdNameID);
    };

    // 記事を取得して応答として送信する
    const articles = await getArticles(municipalitiesName, householdNameID);
    // console.log("articles: ", articles);
    console.log("記事一覧の取得が完了しました。");
    res.status(200).json(articles);
  } else {
    // 市区町村データがない時は、エラーを返す
    res.status(400).json({ error: "市区町村データがありません。" });
  }
});

// 記事の投稿
router.post("/maar/articlelist", async (req, res) => {
  console.log("記事の POST リクエスト受信");

  // ボディから記事データを取得
  const article = req.body;
  // console.log(article);
  // リクエスト形式をチェック

  if (
    article.hasOwnProperty("articleTitle") &&
    article.hasOwnProperty("articleContent") &&
    article.hasOwnProperty("articleTimestamp") &&
    article.hasOwnProperty("municipalitiesName") &&
    article.hasOwnProperty("articleCategory") &&
    article.hasOwnProperty("fileSavePath")
  ) {
    console.log("if分の中");
    // console.log(JSON.stringify(article.municipalitiesName));
    const checkPOSTMunicipalitiesID = async () => {
      const result = await knex
        .select("id")
        .from("municipalitiesList")
        .where("municipalitiesName", article.municipalitiesName);
      // console.log(result);
      return result[0].id;
    };

    const checkPOSTMunicipalitiesIDResult = await checkPOSTMunicipalitiesID();
    // console.log(
    //   "checkPOSTMunicipalitiesIDResult: ",
    //   checkPOSTMunicipalitiesIDResult
    // );

    article.municipalitiesID2 = checkPOSTMunicipalitiesIDResult;
    delete article.municipalitiesName;

    // 既読情報列に空のobj{}を入れる
    article.userReadInfo = "{}";
    // console.log("article: ", article);

    // 新しい記事を追加する関数
    const addArticle = (article) => {
      return knex("articleList").insert(article);
    };

    // 新しい記事を追加し応答として確認を送信
    await addArticle(article);
    console.log("新しい記事を追加");
    res.status(200).send("新しい記事を追加しました。");
  } else {
    // 正常に投稿できない時は、エラーを返す
    res
      .status(400)
      .json({ error: "記事を追加できません。記載内容を確認してください。" });
  }
});

// 既読情報の投稿
router.patch("/maar/articlelist", async (req, res) => {
  console.log("ユーザーの 既読PATCHリクエスト 受信");
  // console.log(req.body);

  // reqから既読日時データを取得
  const readTimestamp = req.body.readTimestamp;
  // データをチェック
  // console.log("readTimestamp : ", readTimestamp);

  // reqからユーザー名を取得
  const userName = req.body.user;
  // データをチェック
  // console.log(userName);

  // reqから記事IDを取得
  const articleId = req.body.articleId;
  // データをチェック
  // console.log(articleId);

  if (userName && readTimestamp && articleId) {
    // console.log("if分の中");
    // console.log(JSON.stringify(article.municipalitiesName));
    const checkPATCHUserId = async () => {
      const result = await knex
        .select("id")
        .from("householdList")
        .where("householdName", userName);
      // console.log("checkPATCHUserId result : ", result);
      return result[0].id;
    };

    const readUserId = await checkPATCHUserId();
    // console.log("readUserId: ", readUserId);

    // articleListのテーブルにある既読管理列のオブジェクトを取得"userReadInfo"
    const getUserReadInfoOfTheArticle = async () => {
      const result = await knex
        .select("userReadInfo")
        .from("articleList")
        .where("id", articleId);
      // console.log(result);
      return result[0].userReadInfo;
    };

    const readInfo = await getUserReadInfoOfTheArticle();
    const readInfoObj = JSON.parse(readInfo);
    // console.log("readInfoObj : ", Number(readInfoObj));

    // userReadInfoのObjにキー：userId、バリュー：既読の日時のプロパティを追加
    readInfoObj[readUserId] = readTimestamp;
    // console.log("Updated readInfoObj : ", readInfoObj);

    // 既読情報を追加したObjをDBに反映
    const updateReadInfo = () => {
      return knex("articleList")
        .update("userReadInfo", readInfoObj)
        .where("id", articleId);
    };

    // 既読情報を追加し応答として確認を送信
    await updateReadInfo();
    console.log("既読情報を追加");
    res
      .status(200)
      .json({ message: "既読情報を更新しました。", userId: readUserId });
  } else {
    // 正常に投稿できない時は、エラーを返す
    res
      .status(400)
      .json({ error: "既読情報を更新できません。内容を確認してください。" });
  }
});

module.exports = router;
