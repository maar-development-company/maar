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
import { PiTaxiLight } from "react-icons/pi";
import { Login } from "./components/Login";
import { ArticleList } from "./components/Articlelist";
import { SingleArticle } from "./components/SingleArticle";
import { AdminMenu } from "./components/AdminMenu";
import { NewPost } from "./components/NewPost";
import { OrganizationSetting } from "./components/OrganizationSetting";
import { PageBackButton } from "./components/PageBackButton";
import { Registration } from "./components/Registration";
import { NewContract } from "./components/NewContract";
import { AdminAssign } from "./components/AdminAssign";
import { NewSurveyPost } from "./components/NewSurveyPost";
import { SurveyList } from "./components/SurveyList";
import MyPage2 from "./components/MyPage2";
import { cognito } from "./components/cognito";
import { Header } from "./components/Header";
import dayjs from "dayjs";
import { Amplify, I18n } from "aws-amplify";
import { Authenticator, translations } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

I18n.putVocabularies(translations);
I18n.setLanguage("ja");

I18n.putVocabularies({
  ja: {
    "Sign in": "ログインする",
    "Sign In": "ログイン",
    "Sign Up": "会員登録する",
    "Create Account": "新規登録",
    Email: "メールアドレス",
    "Enter your Email": "メールアドレスを入力してください",
    "Enter your Password": "パスワードを入力してください",
    Password: "パスワード",
    "Please confirm your Password": "確認用パスワードを入力してください",
    Username: "メールアドレス",
    "Enter your Username": "メールアドレスを入力してください",
    "Your passwords must match": "パスワードを合致させてください",
    "Invalid verification code provided, please try again.":
      "確認コードに誤りがあるため、再度お試しください",
    "Back to Sign In": "ログイン画面に戻る",
    "Incorrect username or password.": "メールアドレスかパスワードが無効です。",
    "Cannot reset password for the user as there is no registered/verified email or phone_number":
      "会員登録されていないためパスワードリセットできません",
    "Username should be an email.": "メールアドレスを入力してください",
    "Password did not conform with policy: Password not long enough":
      "パスワードポリシーに反しています。大文字小文字数字記号を含む８文字以上で設定しなさい",
    "Password did not conform with policy: Password must have numeric characters":
      "パスワードポリシーに反しています。大文字小文字数字記号を含む８文字以上で設定しなさい",
    "Password did not conform with policy: Password must have lowercase characters":
      "パスワードポリシーに反しています。大文字小文字数字記号を含む８文字以上で設定しなさい",
    "Password did not conform with policy:":
      "パスワードポリシーに反しています。大文字小文字数字記号を含む８文字以上で設定しなさい",
  },
});

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
            <header className="h-24 w-full text-center p-2 bg-blue-800 text-white sticky top-0 z-0">
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
