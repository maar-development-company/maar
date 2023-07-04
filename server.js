const bcrypt = require("bcryptjs");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const muniRouter = require('./muni');
const loginRouter = require('./login');
const uploadRouter = require('./upload');
const articleRouter = require('./article');
const householdRouter = require('./household');
const adminRouter = require('./admin');

const knex = require('./db'); // knexの設定を分離

const app = express();
const port = process.env.PORT || 8080;

const buildPath = path.join(__dirname, "./build");

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());

app.use('/muni', muniRouter);
app.use('/', loginRouter);
app.use('/upload', uploadRouter);
// app.use('/articlelist',articleRouter);
// app.use('/householdList',householdRouter);
// app.use('/admin_assign',adminRouter);
app.use(articleRouter);
app.use(householdRouter);
app.use(adminRouter);

app.listen(port, () => {
  console.log(`Server is online on port: ${port}`);
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