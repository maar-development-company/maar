const bcrypt = require("bcryptjs");
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

// 組織構造の登録
app.post("/muni", async (req, res) => {
	const postData = req.body;
	console.log(postData);
	postData.municipalitiesID = postData.municipalitiesID.toString();

	// groupNumArrayの各要素を対象にmap関数を用いて新たな配列を作成
	postData.groupNumArray = postData.groupNumArray.map((num) =>
		Array.from({ length: num }, (_, i) => i + 1)
	);
	console.log("postData.groupNumArray: ", postData.groupNumArray);
	console.log("postData", postData);
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

// ログイン機能
app.post("/maar/login", async (req, res) => {

	console.log("ログイン情報をPOST受信");

	const postData = req.body;
	console.log("ログインのbodyチェック", postData);

	//ログイン情報の確認
	const postDataCheckFunc = async () => {
		// postDateのloginCategoryで分岐0:通常 1:新規登録
		if (postData.loginCategory === 1) {
			console.log("こっちは新規");

			// 地域名取得
			// const checkMunicipalitiesID = async () => {
			//   return knex
			//     .select("id")
			//     .from("municipalitiesList")
			//     .where("municipalitiesName", postData.municipalities);
			// };
			// const MunicipalitiesIDResult = await checkMunicipalitiesID();
			// console.log("新規登録用市ID: ", MunicipalitiesIDResult);

			const insertHouseHoldList = async () => {
				return knex("householdList")
					.insert({
						householdName: 1,
						householdTel: "77777777777",
						householdMail: postData.mailadress,
						householdAge: "20",
						familySize: "1",
						roleFlag: "0",
						block1: "",
						block2: "",
						block3: "",
					})
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

			// const checkMunicipalitiesID = async () => {
			//   return knex
			//     .select("id")
			//     .from("municipalitiesList")
			//     .where("municipalitiesName", postData.municipalities);
			// };
			// const MunicipalitiesIDResult = await checkMunicipalitiesID();
			// console.log("MunicipalitiesIDResult: ", MunicipalitiesIDResult);

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
    article.hasOwnProperty('articleTitle') &&
    article.hasOwnProperty('articleContent') &&
    article.hasOwnProperty('articleTimestamp') &&
    article.hasOwnProperty('municipalitiesName') &&
    article.hasOwnProperty('articleCategory') &&
    article.hasOwnProperty('fileSavePath')
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
