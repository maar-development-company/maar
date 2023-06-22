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
app.get("/", async (req, res) => {
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
      return knex.select("id").from("municipalitiesList").where("municipalitiesName", postData.municipalities);
    }
    const MunicipalitiesIDResult = await checkMunicipalitiesID();
    console.log('MunicipalitiesIDResult: ', MunicipalitiesIDResult);

    const checkmailAdressID = async () => {
      return knex.select("id").from("householdList").where("householdMail", postData.mailadress);
    }
    const MailAdressIDResult = await checkmailAdressID();
    console.log('MailAdressIDResult: ', MailAdressIDResult[0].id);

    const checkPassID = async () => {
      return knex.select("id").from("householdPassList").where("householdPass", postData.password);
    }
    const PassIDResult = await checkPassID();
    console.log('PassIDResult: ', PassIDResult); 

    const checkLoginInfo = async () => {
      return knex.select("id").from("householdTable").where("householdNameID", MailAdressIDResult[0].id)
        .andWhere("householdPassID", PassIDResult[0].id)
    }
    const checkLoginResult = await checkLoginInfo();
    console.log('checkLoginResult : ', checkLoginResult);

    if (checkLoginResult.length > 0) {
      console.log('checkLoginResult[0].id: ', checkLoginResult[0].id);
      const getRoleFunc = async () => {
        return knex.select("roleFlag", "householdName").from("householdList").where("id", checkLoginResult[0].id)
      }
      const roleResult = await getRoleFunc();
      console.log('roleResult: ', roleResult);

      let role;
      if (roleResult.length > 0) {
        if (roleResult[0].roleFlag === "0") {
          role = 2;
        } else {
          role = 1;
        }
      } else {
        role = 0;
      }

      const resultObj = {
        judge: role,
        name: roleResult[0].householdName
      };
      return resultObj;
    }
  }

  const postDataCheckResult = await postDataCheckFunc();
  console.log(postDataCheckResult);
  
  res.status(200).json(postDataCheckResult);
});

app.listen(port, () => {
  console.log(`Server is online on port: ${port}`);
});


// MunicipalitiesIDResult:  [ { id: 2 } ]
// MailAdressIDResult:  [ { id: 1 } ]
// PassIDResult:  [ { id: 1 } ]
// {"mailadress":"aaaa@mail", "password":"ah29f9d8","municipalities":"meiwa"}
// 返す形
// {judge:0or1or2,name:▢▢,role: }

// 記事の表示と登録
// app.get("/maar/articlelist?municipalities", async (req, res) => {
// // app.get("/maar/articlelist", async (req, res) => {
//   console.log("記事の一覧をget受信");
//   const id = req.query.id;
//   console.log(id);
//   const getMyCard = (id) => {
//     return knex.select("*").from("").where("", id);
//   };
//   const myCard = await getMyCard(id);
//   console.log("getObj完了");
//   res.status(200).json(myCard);
// });


// app.get("/maar/articlelist", async (req, res) => {
//   console.log("Article list GET request received.");
//   // get municipalities from query parameters
//   const municipalities = req.query.municipalities;

//   // check if municipalities parameter exists
//   if (municipalities) {
//     console.log(`Municipalities ID: ${municipalities}`);

//     // Define a function that retrieves articles for a specific municipality
//     const getArticles = (municipalities) => {
//       return knex.select("*").from("articlelist").where("municipalitiesID2", municipalities);
//     };

//     // Retrieve articles and send them as a response
//     const articles = await getArticles(municipalities);
//     console.log("Article list retrieval completed.");
//     res.status(200).json(articles);
//   } else {
//     // if municipalities parameter does not exist, send an error message
//     res.status(400).json({ error: "Municipalities parameter is missing from the query." });
//   }
// });

// app.post('/notes', async (req, res) => {
//   try {
//     const { id, title, content, updateDay } = req.body;
//     const note = await knex('notes').insert({ id, title, content, updateDay }).returning('*');
//     res.json(note);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });



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