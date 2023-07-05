// const bcrypt = require("bcryptjs");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
// ルーティングモジュールをインポート
const muniRouter = require('./muni');
const loginRouter = require('./login');
const uploadRouter = require('./upload');
const articleRouter = require('./article');
const householdRouter = require('./household');
const adminRouter = require('./admin');
// knexの設定を分離
const knex = require('./db'); 

const app = express();
const port = process.env.PORT || 8080;

const buildPath = path.join(__dirname, "./build");

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());
// ミドルウェア関数をロード
app.use(muniRouter);
app.use(loginRouter);
app.use(uploadRouter);
app.use(articleRouter);
app.use(householdRouter);
app.use(adminRouter);

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
    console.log("articles: ", articles);
    console.log("記事一覧の取得が完了しました。");
    res.status(200).json(articles);
  } else {
    // 市区町村データがない時は、エラーを返す
    res.status(400).json({ error: "市区町村データがありません。" });
  }
});

// 世帯リスト（地域IDから取得）
app.get("/maar/householdList", async (req, res) => {
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

// 記事の投稿
app.post("/maar/articlelist", async (req, res) => {
  console.log("記事の POST リクエスト受信");

  // ボディから記事データを取得
  const article = req.body;
  console.log(article);
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
    console.log(JSON.stringify(article.municipalitiesName));
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

    // 既読情報列に空のobj{}を入れる
    article.userReadInfo = "{}";
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

// ここから
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

// 既読情報の投稿
app.patch("/maar/articlelist", async (req, res) => {
  console.log("ユーザーの 既読PATCHリクエスト 受信");
  console.log(req.body);

  // reqから既読日時データを取得
  const readTimestamp = req.body.readTimestamp;
  // データをチェック
  console.log("readTimestamp : ", readTimestamp);

  // reqからユーザー名を取得
  const userName = req.body.user;
  // データをチェック
  console.log(userName);

  // reqから記事IDを取得
  const articleId = req.body.articleId;
  // データをチェック
  console.log(articleId);

  if (userName && readTimestamp && articleId) {
    // console.log("if分の中");
    // console.log(JSON.stringify(article.municipalitiesName));
    const checkPATCHUserId = async () => {
      const result = await knex
        .select("id")
        .from("householdList")
        .where("householdName", userName);
      console.log("checkPATCHUserId result : ", result);
      return result[0].id;
    };

    const readUserId = await checkPATCHUserId();
    console.log("readUserId: ", readUserId);

    // articleListのテーブルにある既読管理列のオブジェクトを取得"userReadInfo"
    const getUserReadInfoOfTheArticle = async () => {
      const result = await knex
        .select("userReadInfo")
        .from("articleList")
        .where("id", articleId);
      console.log(result);
      return result[0].userReadInfo;
    };

    const readInfo = await getUserReadInfoOfTheArticle();
    const readInfoObj = JSON.parse(readInfo);
    console.log("readInfoObj : ", Number(readInfoObj));

    // userReadInfoのObjにキー：userId、バリュー：既読の日時のプロパティを追加
    readInfoObj[readUserId] = readTimestamp;
    console.log("Updated readInfoObj : ", readInfoObj);

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

// ***********管理者登録の処理***********
app.patch("/maar/admin_assign", async (req, res) => {
  console.log("管理者更新の PATCHリクエスト 受信");
  console.log(req.body);

  // reqから更新する世帯リストを取得
  const householdList = req.body;
  // データをチェック
  console.log("householdList : ", householdList);
  const patchRollFlag = async (id, roleFlag) => {
    return knex("householdList").update("roleFlag", roleFlag).where("id", id);
  };

  if (householdList) {
    for (let i = 0; i < householdList.length; i++) {
      await patchRollFlag(householdList[i].id, householdList[i].roleFlag);
    }

    res.status(200).send("登録完了");
  } else {
    // 正常に投稿できない時は、エラーを返す
    res
      .status(400)
      .send("管理者情報を更新できません。内容を確認してください。");
  }
});
// ***********************************


// ***********************************
//投稿通知先を配列にして返す 森作
app.get("/maar/mailaddress/:municipalitiesname", async (req, res) => {
  console.log("該当地域に所属する世帯のアドレスのGETリクエスト受信");
  // パスパラメーターから市町村を取得
  const municipalitiesName = req.params.municipalitiesname;
  console.log(municipalitiesName);
  // 市区町村データがあるか確認
  if (municipalitiesName) {
    //municipalitiesIdに変換
    const getMunicipalitiesId = async () => {
      return knex
        .select("id")
        .from("municipalitiesList")
        .where("municipalitiesName", municipalitiesName)
    }
    const municipalitiesIdArrObj = await getMunicipalitiesId()
    const municipalitiesId = municipalitiesIdArrObj[0].id
    console.log("IDを出力しますよ〜〜〜〜〜〜〜〜", municipalitiesId);
    // メールリストを取得する関数
    const getEmailList = async () => {
      console.log("世帯リストのセレクト開始");
      return knex
        .select("householdMail")
        .from("householdList")
        .where("municipalitiesID", municipalitiesId)
    };
    // メールアドレスリストを取得して応答として送信する
    const emailList = await getEmailList();
    console.log("emailList: ", emailList);
    console.log("世帯リスト一覧の取得が完了しました。");
    // メールアドレスリストを応答として送信する
    res.status(200).send(emailList);
  } else {
    // 市区町村データがない時は、エラーを返す
    res.status(400).json({ error: "市町村のデータがありまへん。" });
  }
});
// ***********************************
  // 参考コード
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
