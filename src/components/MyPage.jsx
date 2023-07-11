import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GrCatalog } from "react-icons/gr";
import { BsGear } from "react-icons/bs";
import { BiDownArrowAlt } from "react-icons/bi";
import { SlBubble } from "react-icons/sl";
import { AiOutlineHome } from "react-icons/ai";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { Login } from "./Login";
import { ArticleList } from "./Articlelist";
import { SingleArticle } from "./SingleArticle";
import { AdminMenu } from "./AdminMenu";
import { NewPost } from "./NewPost";
import { OrganizationSetting } from "./OrganizationSetting";
import { PageBackButton } from "./PageBackButton";
import dayjs from "dayjs";
import { NewContract } from "./NewContract";
import { PiTaxiLight } from "react-icons/pi";
import { FileUploader } from "./FileUploader";
import { DisplayImage } from "./DisplayImage";
import { TakePicture2 } from "./TakePicture2";
import { AdminAssign } from "./AdminAssign";
import { Auth } from "aws-amplify";
import { RegistrationCog } from "./RegistrationCog";
import { Authenticator } from "@aws-amplify/ui-react";

const AWS = require("aws-sdk");

const URL =
  process.env.NODE_ENV === "production"
    ? "https://maar-front.onrender.com"
    : "http://localhost:8080";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

const MyPage = (props) => {
  // useState------
  const [loginCom, setLoginCom] = useState(0);
  const [userName, setUserName] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [municipalityId, setMunicipalityId] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState("");
  const [municipalitiesList, setMunicipalitiesList] = useState([]);
  const [municipalities, setMunicipalities] = useState("");

  // console.log("loginCom : ", loginCom);
  // useState-終-----

  const { user, signOut } = useAuthenticator((context) => [context.user]);
  // kokokokokoko
  const [email, setEmail] = useState(user.attributes.email);
  const [user1, setUser1] = useState(user);
  const [signOut1, setSignOut] = useState(signOut);

  //S3ファイル一覧取得ー始ーーーーーーーーーーーーーーー
  const s3 = new AWS.S3();
  const bucketName = "article-area";
  // async function listObjects(bucketName) {
  //   try {
  //     const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
  //     console.log("バケット内のオブジェクト一覧:");
  //     response.Contents.forEach((obj) => {
  //       console.log(obj.Key);
  //     });
  //   } catch (error) {
  //     console.error("オブジェクト一覧の取得に失敗しました:", error);
  //   }
  // }
  // listObjects(bucketName);
  //S3ファイル一覧取得ー終ーーーーーーーーーーーーーーー
  // ログイン状態を確認する。
  useEffect(() => {
    console.log("useEffectの中");
    // console.log(URL);
    checkAccountFunc();
    getMunicipalitiesFunc();
    const data = sessionStorage.getItem("loginInfo");
    const user = sessionStorage.getItem("loginResultInfo");
    user
      ? setMunicipality(JSON.parse(user).municipalitiesName)
      : setMunicipality("");
    user ? setLoginCom(JSON.parse(user).judge) : setLoginCom(0);
    user ? setUserName(JSON.parse(user).name) : setUserName("");
  }, []);

  const writeToSessionStorage = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  const logout = () => {
    sessionStorage.removeItem("loginInfo");
    sessionStorage.removeItem("loginResultInfo");
    setLoginCom(0);
    location.href = "/";
  };

  const checkAccountFunc = async () => {
    // ここを森さんの書いたやつに書き直す
    const loginTimestamp = new Date();
    const year = loginTimestamp.getFullYear();
    const month = String(loginTimestamp.getMonth() + 1).padStart(2, "0");
    const day = String(loginTimestamp.getDate()).padStart(2, "0");
    const hour = String(loginTimestamp.getHours()).padStart(2, "0");
    const minute = String(loginTimestamp.getMinutes()).padStart(2, "0");
    const second = String(loginTimestamp.getSeconds()).padStart(2, "0");
    const formattedLoginTimestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    // console.log("aaaaaaaaaaaaa   ", user.attributes.email);
    const data = {
      loginCategory: 7,
      mailadress: emailAddress,
      password: "",
      municipalities: "",
      loginTimestamp: formattedLoginTimestamp,
    };
    const res = await fetch(`${URL}/maar/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log("result");
    // console.log(result);

    writeToSessionStorage("loginInfo", data);
    writeToSessionStorage("loginResultInfo", result);

    if (result.judge === 0) {
      setLoginCom(0);
      const setAccountObj = {
        householdName: "",
        householdTel: "",
        householdMail: "",
        householdAge: "",
        familySize: "",
        roleFlag: "",
        block1: "",
        block2: "",
        block3: "",
        municipalitiesID: "",
        municipalities: "",
        lastLoginTimestamp: "",
      };
    } else {
      setLoginCom(1);
      const data = sessionStorage.getItem("loginInfo");
      const user = sessionStorage.getItem("loginResultInfo");
    }
  };

  const getMunicipalitiesFunc = async () => {
    try {
      const response = await fetch(`${URL}/muni`);
      if (!response.ok) {
        throw new Error("Failed to fetch.");
      }
      const municipalitiesObj = await response.json();
      // console.log(municipalitiesObj);
      if (municipalitiesObj.length !== municipalitiesList.length) {
        setMunicipalitiesList(municipalitiesObj);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryTownChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedTown = municipalitiesList.find(
      (town) => town.id === selectedId
    );
    setMunicipalityId(selectedTown.id);
    setMunicipality(selectedTown.municipalitiesName);
    setMunicipalities(selectedTown.municipalitiesName);
  };

  const menuStyle =
    "m-4 p-4 h-44 flex items-center justify-center md:h-28 border-solid rounded-3xl border-4 border-gray-300 md:flex md:flex-row md:justify-start";
  return (
    <>
      <main>
        <div>
          {loginCom === 0 && (
            <Router>
              <Routes>
                <>
                  <Route
                    path="/"
                    element={
                      <>
                        <RegistrationCog user1={user1} signOut1={signOut1} />
                      </>
                    }
                  />
                </>
              </Routes>
            </Router>
          )}
          {loginCom !== 0 && (
            <Router>
              <header className="h-36 p-2 bg-gradient-to-b from-blue-500 to-blue-200 sticky top-0 z-0">
                <p className="text-4xl text-center">まある</p>
                <p className="text-4xl text-left">{municipality}</p>
                <p className="text-4xl text-left">{userName}さん</p>
              </header>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <div className="link-container">
                        <Link to="/articlelist" state={{ user: userName }}>
                          <div className={menuStyle}>
                            <div className="flex flex-col items-center justify-center md:flex-row">
                              <div className="flex items-center justify-center text-6xl md:justify-start">
                                <GrCatalog />
                              </div>
                              <p className="ml-5 mr-5 items-center justify-center text-3xl ">
                                回覧板
                              </p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/">
                          <div className={menuStyle}>
                            <div className="flex flex-col items-center justify-center md:flex-row">
                              <div className="flex items-center justify-center text-6xl md:justify-start">
                                <SlBubble />
                              </div>
                              <p className="ml-5 mr-5 items-center justify-center text-3xl ">
                                アンケート回答
                              </p>
                            </div>
                          </div>
                        </Link>
                        <a className={menuStyle} href="tel:000-1234-5678">
                          <div className="flex flex-col items-center justify-center md:flex-row">
                            <div className="flex items-center justify-center text-6xl md:justify-start">
                              <PiTaxiLight />
                            </div>
                            <p className="ml-5 mr-5 items-center justify-center text-3xl ">
                              タクシーを呼ぶ
                            </p>
                          </div>
                        </a>
                        {loginCom === 2 && (
                          <Link to="/AdminMenu">
                            <div className={menuStyle}>
                              <div className="flex flex-col items-center justify-center md:flex-row">
                                <div className="flex items-center justify-center text-6xl md:justify-start">
                                  <BsGear />
                                </div>
                                <p className="ml-5 mr-5 text-3xl">
                                  管理者メニュー
                                </p>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    </>
                  }
                />
                <Route
                  path="/articlelist"
                  element={
                    <div>
                      <ArticleList
                        municipalityId={municipalityId}
                        municipality={municipality}
                      />
                    </div>
                  }
                />
                <Route
                  path="/SingleArticle"
                  element={
                    <div>
                      <SingleArticle />
                    </div>
                  }
                />
                {loginCom === 2 && (
                  <Route
                    path="/AdminMenu"
                    element={
                      <div>
                        <AdminMenu
                          municipality={municipality}
                          municipalityId={municipalityId}
                          userName={userName}
                        />
                      </div>
                    }
                  />
                )}
                {loginCom === 2 && (
                  <Route
                    path="/NewPost"
                    element={
                      <div>
                        <NewPost
                          municipalityId={municipalityId}
                          municipality={municipality}
                          userName={userName}
                        />
                      </div>
                    }
                  />
                )}
                {loginCom === 2 && (
                  <Route
                    path="/OrganizationSetting"
                    element={
                      <div>
                        <OrganizationSetting />
                      </div>
                    }
                  />
                )}
                {loginCom === 2 && (
                  <Route
                    path="/AdminAssign"
                    element={
                      <div>
                        <AdminAssign />
                      </div>
                    }
                  />
                )}
              </Routes>

              <footer className="w-full fixed bottom-0 flex flex-row items-center justify-center bg-gradient-to-b from-blue-200 to-blue-500 ">
                <PageBackButton />
                <button
                  onClick={() => (location.href = "/")}
                  className="bg-blue-800 hover:bg-blue-700 text-white border-2 border-white rounded px-4 py-2 w-30 mt-2 mr-3 text-xl flex flex-row"
                >
                  <div
                    className="flex items-center justify-center md:justify-start"
                    onClick={() => console.log(loginCom)}
                  ></div>
                  <span>ホーム</span>
                </button>
                <button
                  className="bg-blue-800 hover:bg-blue-700 text-white border-2 border-white rounded px-4 py-2 w-fit mt-2 text-xl flex flex-row"
                  onClick={logout}
                >
                  <span>ログアウト</span>
                </button>
              </footer>
            </Router>
          )}
        </div>
        <li>
          email: <input defaultValue={user.attributes.email} />
        </li>
        <button onClick={signOut}>Sign out</button>
      </main>
    </>
  );
};

export default MyPage;
