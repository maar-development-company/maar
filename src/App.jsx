import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
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
import dayjs from "dayjs";

function App() {
  // console.log(process.env);
  //loginCom = 0 ログインしてない　1:普通ユーザー　2:管理者
  const [loginCom, setLoginCom] = useState(0);
  const [municipality, setMunicipality] = useState("meiwa");
  const [municipalityId, setMunicipalityId] = useState("1");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState("");
  console.log("loginCom : ", loginCom);

  const menuStyle =
    "m-4 p-4 h-44 flex items-center justify-center md:h-28 border-solid rounded-3xl border-4 border-gray-300 md:flex md:flex-row md:justify-start";
  return (
    <div>
      {loginCom === 0 && (
        <>
          <Login
            loginCom={loginCom}
            setLoginCom={setLoginCom}
            municipality={municipality}
            setMunicipality={setMunicipality}
            municipalityId={municipalityId}
            setMunicipalityId={setMunicipalityId}
            emailAddress={emailAddress}
            setEmailAddress={setEmailAddress}
            password={password}
            setPassword={setPassword}
          />
        </>
      )}
      {loginCom !== 0 && (
        <Router>
          <header className="p-2 bg-gradient-to-b from-blue-500 to-blue-200 sticky top-0 z-50">
            <p className="text-4xl text-center">まある</p>
            <p className="text-4xl text-left">{municipality}</p>
            <p className="text-4xl text-left">太田 フサ子さん</p>
          </header>
          {/* <BiDownArrowAlt className="animate-pulse" /> */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="link-container">
                    <Link to="/articlelist">
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

                    {loginCom === 2 && (
                      <Link to="/AdminMenu">
                        <div className={menuStyle}>
                          <div className="flex flex-col items-center justify-center md:flex-row">
                            <div className="flex items-center justify-center text-6xl md:justify-start">
                              <BsGear />
                            </div>
                            <p className="ml-5 mr-5 text-3xl">管理者メニュー</p>
                          </div>
                          {/* </span> */}
                          {/* <p className="mt-2">{`${municipality}からのお知らせです`}</p> */}
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
                    />
                  </div>
                }
              />
            )}
          </Routes>
          <footer className="fixed bottom-0 flex flex-row items-center justify-center">
            <button className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-40 mt-2 mr-5 text-3xl flex flex-row">
              <IoReturnDownBackOutline />
              <span>戻る</span>
            </button>
            <button
              onClick={() => (location.href = "/")}
              className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-40 mt-2 text-3xl flex flex-row"
            >
              <div className="flex items-center justify-center md:justify-start">
                <AiOutlineHome />
              </div>
              <span>ホーム</span>
            </button>
          </footer>
        </Router>
      )}
    </div>
  );
}

// "position: fixed; bottom: 0; width: 100%"

export default App;
