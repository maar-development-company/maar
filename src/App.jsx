import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GrCatalog } from "react-icons/gr";
import { BsGear } from "react-icons/bs";
import { BiDownArrowAlt } from "react-icons/bi";
import { SlBubble } from "react-icons/sl";
import { AiOutlineHome } from "react-icons/ai";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { Login } from "./components/Login";
import { ArticleList } from "./components/Articlelist";
import { SingleArticle } from "./components/SingleArticle";
import { AdminMenu } from "./components/AdminMenu";
import { NewPost } from "./components/NewPost";
import { OrganizationSetting } from "./components/OrganizationSetting";
import { PageBackButton } from "./components/PageBackButton";
import dayjs from "dayjs";
import { Registration } from "./components/Registration";
import { NewContract } from "./components/NewContract";
import { PiTaxiLight } from "react-icons/pi";
import { AdminAssign } from "./components/AdminAssign";
import { NewSurveyPost } from "./components/NewSurveyPost";
import { SurveyList } from "./components/SurveyList";
import { cognito } from "./components/cognito";
import { Header } from "./components/Header";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import MyPage2 from "./components/MyPage2";

Amplify.configure({
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_AWS_USER_POOLS_CLIENT_ID,
});

const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

function App() {
  //S3ファイル一覧取得ー始ーーーーーーーーーーーーーーー
  //　アクセス数が増えるためコメントアウトしておく
  //	const s3 = new AWS.S3();
  // const bucketName = "article-area";

  // async function listObjects(bucketName) {
  // 	try {
  // 		const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
  // 		console.log("バケット内のオブジェクト一覧:");
  // 		response.Contents.forEach((obj) => {
  // 			console.log(obj.Key);
  // 		});
  // 	} catch (error) {
  // 		console.error("オブジェクト一覧の取得に失敗しました:", error);
  // 	}
  // }

  // バケット名を指定してオブジェクト一覧を取得します

  // listObjects(bucketName);
  //S3ファイル一覧取得ー終ーーーーーーーーーーーーーーー

  // console.log(process.env);
  //loginCom = 0 ログインしてない　1:普通ユーザー　2:管理者
  const [loginCom, setLoginCom] = useState(0);
  // const [userName, setUserName] = useState("");
  // const [municipality, setMunicipality] = useState("");
  // const [municipalityId, setMunicipalityId] = useState("");
  // const [emailAddress, setEmailAddress] = useState("");
  // const [password, setPassword] = useState("");
  // const [taxiPhoneNumber, setTaxiPhoneNumber] = useState("");
  // const [history, setHistory] = useState("");
  // console.log("loginCom : ", loginCom);

  // ログイン状態を確認する。
  // useEffect(() => {
  //   const data = sessionStorage.getItem("loginInfo");
  //   const user = sessionStorage.getItem("loginResultInfo");
  //   // console.log(data);
  //   // console.log(user);
  //   user
  //     ? setMunicipality(JSON.parse(user).municipalitiesName)
  //     : setMunicipality("");
  //   user ? setLoginCom(JSON.parse(user).judge) : setLoginCom(0);
  //   user ? setUserName(JSON.parse(user).name) : setUserName("");
  //   user
  //     ? setTaxiPhoneNumber(JSON.parse(user).taxiNumber)
  //     : setTaxiPhoneNumber("");
  // }, []);

  // const logout = () => {
  //   sessionStorage.removeItem("loginInfo");
  //   sessionStorage.removeItem("loginResultInfo");
  //   setLoginCom(0);
  //   location.href = "/";
  // };

  const menuStyle =
    "m-4 p-4 h-44 flex items-center justify-center md:h-28 border-solid rounded-3xl border bg-gray-100 hover:bg-gray-200 border-gray-300 shadow-lg md:flex md:flex-row md:justify-start";
  return (
    <>
      <Router>
        <div>
          {loginCom === 0 && (
            <header className="h-24 p-2 bg-blue-800 text-white sticky top-0 z-0">
              <p className="text-4xl text-center">まある</p>
              <p className="text-4xl text-center">ログイン画面</p>
            </header>
          )}
          <Authenticator>
            {({ signOut, user }) => (
              <Authenticator.Provider>
                <MyPage2 loginCom={loginCom} setLoginCom={setLoginCom} />
              </Authenticator.Provider>
            )}
          </Authenticator>
        </div>
      </Router>
    </>
  );
}
export default App;
