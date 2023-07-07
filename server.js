const bcrypt = require("bcryptjs");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
// ルーティングモジュールをインポート
const muniRouter = require("./muni");
const loginRouter = require("./login");
const uploadRouter = require("./upload");
const articleRouter = require("./article");
const householdRouter = require("./household");
const adminRouter = require("./admin");
const mailaddressRouter = require("./mailaddress");
// knexの設定を分離
const knex = require("./db");

const app = express();
const port = process.env.PORT || 8080;

const buildPath = path.join(__dirname, "./build");

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());

// ミドルウェア関数をロード
app.use(uploadRouter);
app.use(muniRouter);
app.use(mailaddressRouter);
app.use(loginRouter);
app.use(articleRouter);
app.use(householdRouter);
app.use(adminRouter);

app.listen(port, () => {
  console.log(`Server is online on port: ${port}`);
});
