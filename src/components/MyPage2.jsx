import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RegistrationCog } from "./RegistrationCog";
import React, { useState, useEffect, useRef } from "react";
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

const MyPage2 = ({ loginCom, setLoginCom }) => {
  const { user, signOut, authState } = useAuthenticator((context) => [
    context.user,
    context.signOut,
    context.authState,
  ]);
  const [Num, setNum] = useState(0);
  const [Num1, setNum1] = useState(0);

  const [userName, setUserName] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [municipalityId, setMunicipalityId] = useState("");
  const [emailAddress, setEmailAddress] = useState(user.attributes.email);
  const [password, setPassword] = useState("");
  const [taxiPhoneNumber, setTaxiPhoneNumber] = useState("");
  const [history, setHistory] = useState("");
  const [municipalitiesList, setMunicipalitiesList] = useState([]);
  const [municipalities, setMunicipalities] = useState("");
  console.log("loginCom : ", loginCom);

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

  useEffect(() => {
    console.log("ログイン実行");
    login();
  }, []);

  useEffect(() => {
    console.log("useEffectの中");
    console.log(URL);
    // checkAccountFunc();
    getMunicipalitiesFunc();
    console.log(loginCom);
    const data = sessionStorage.getItem("loginInfo");
    const user = sessionStorage.getItem("loginResultInfo");
    user
      ? setMunicipality(JSON.parse(user).municipalitiesName)
      : setMunicipality("");

    const judgeNum = JSON.parse(user)?.judge;
    console.log("judgeNum   ", judgeNum);
    if (judgeNum !== null) {
      judgeNum === 1
        ? setLoginCom(1)
        : judgeNum === 2
        ? setLoginCom(2)
        : setLoginCom(0);
    }
    console.log("loginCom   ", loginCom);
    // user ? setLoginCom(JSON.parse(user).judge) : setLoginCom(0);
    user ? setUserName(JSON.parse(user).name) : setUserName("");

    user
      ? setTaxiPhoneNumber(JSON.parse(user).taxiNumber)
      : setTaxiPhoneNumber("");
  }, [Num]);

  useEffect(() => {
    if (authState === "signedout") {
      console.log("1");
    } else {
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

        console.log("aaaaaaaaaaaaa   ", user.attributes.email);
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
        console.log(result);

        if (result.judge === 0) {
          setLoginCom(0);
          const data = {
            loginCategory: 7,
            mailadress: "",
            password: "",
            municipalities: "",
            loginTimestamp: formattedLoginTimestamp,
          };
          const result = {
            judge: 0,
            name: "",
            houseHoldNameID: "",
            tel: "",
            mail: "",
            age: "",
            municipalitiesID: "",
            municipalitiesName: "",
            blockName: "",
            groupNum: "",
          };
          writeToSessionStorage("loginInfo", data);
          writeToSessionStorage("loginResultInfo", result);
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
          setNum(1);
          console.log("Num ", Num);
          const data = sessionStorage.getItem("loginInfo");
          const user = sessionStorage.getItem("loginResultInfo");
        }
      };
      checkAccountFunc();
    }
  }, [authState, user]);

  const writeToSessionStorage = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  const logout = () => {
    console.log("ログアウト！");
    sessionStorage.removeItem("loginInfo");
    sessionStorage.removeItem("loginResultInfo");
    signOut();
    setTimeout(() => {
      setLoginCom(0);
    }, 400);
  };

  const getMunicipalitiesFunc = async () => {
    try {
      const response = await fetch(`${URL}/muni`);
      if (!response.ok) {
        throw new Error("Failed to fetch.");
      }
      const municipalitiesObj = await response.json();
      console.log(municipalitiesObj);
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

  // const login = async () => {
  //   //バリデーション
  //   if (emailAddress === "" || password === "" || municipality === "") {
  //     return window.alert("未入力の項目があります");
  //   }
  //   //データベースにPOSTする処理
  //   console.log("loginボタンが押された");
  //   try {
  //     const data = {
  //       loginCategory: 0,
  //       mailadress: emailAddress,
  //       password: password,
  //       municipalities: municipalities,
  //     };
  //     console.log("dataの中身　　", data);
  //     const res = await fetch(`${URL}/maar/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     const result = await res.json();
  //     console.log(result);

  //     writeToSessionStorage("loginInfo", data);
  //     writeToSessionStorage("loginResultInfo", result);

  //     if (result.judge === 0) {
  //       window.alert("町内会名又はEmailAddress又はpasswordが間違っています");
  //     } else if (result.judge === 1) {
  //       setLoginCom(1);
  //       window.alert(`ようこそ${result.name}さん`);
  //     } else if (result.judge === 2) {
  //       setLoginCom(2);
  //       window.alert(`ようこそ管理者の${result.name}さん`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const login = async () => {
    //データベースにPOSTする処理
    console.log("loginボタンが押された");
    try {
      const loginTimestamp = new Date();

      const year = loginTimestamp.getFullYear();
      const month = String(loginTimestamp.getMonth() + 1).padStart(2, "0");
      const day = String(loginTimestamp.getDate()).padStart(2, "0");
      const hour = String(loginTimestamp.getHours()).padStart(2, "0");
      const minute = String(loginTimestamp.getMinutes()).padStart(2, "0");
      const second = String(loginTimestamp.getSeconds()).padStart(2, "0");

      const formattedLoginTimestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

      const data = {
        loginCategory: 0,
        mailadress: emailAddress,
        password: password,
        municipalities: municipality,
        loginTimestamp: formattedLoginTimestamp,
      };
      console.log("dataの中身    ", data);
      const res = await fetch(`${URL}/maar/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log("ログインのトライの中！！！！！！！！");
      console.log(result);

      writeToSessionStorage("loginInfo", data);
      writeToSessionStorage("loginResultInfo", result);
      if (result.judge === 0) {
      } else if (result.judge === 1) {
        setLoginCom(1);
        setUserName(result.name);
        setMunicipality(result.municipalitiesName);
      } else if (result.judge === 2) {
        console.log("!!!!!!!!!!!!");
        setLoginCom(2);
        setUserName(result.name);
        setMunicipality(result.municipalitiesName);
        console.log(loginCom);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const menuStyle =
    "m-4 p-4 h-44 flex items-center justify-center md:h-28 border-solid rounded-3xl border bg-gray-100 hover:bg-gray-200 border-gray-300 shadow-lg md:flex md:flex-row md:justify-start";
  return (
    <main>
      {loginCom === 0 ? (
        <RegistrationCog setLoginCom={setLoginCom} loginCom={loginCom} />
      ) : (
        <>
          <header className="h-24 p-2 bg-blue-800 text-white sticky top-0 z-0">
            <p className="text-4xl text-left">{municipality}</p>
            <p className="text-4xl text-left">{userName}さん</p>
          </header>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="link-container overflow-y-auto fixed top-24 bottom-12 right-0 left-0">
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
                    <a className={menuStyle} href={taxiPhoneNumber}>
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
                            <p className="ml-5 mr-5 text-3xl">管理者メニュー</p>
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

          <footer className="w-full fixed bottom-0 flex flex-row items-center justify-center bg-blue-800 text-white ">
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
        </>
      )}
      {/* <button onClick={signOut}>Sign out</button>
      <p>
        <Link to="/user_edit">ユーザー情報変更</Link>
      </p> */}
    </main>
  );
};

export default MyPage2;
