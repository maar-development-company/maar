import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { GrCatalog } from "react-icons/gr";
import { BsFillPencilFill } from "react-icons/bs";
import { BiDownArrowAlt } from "react-icons/bi";
import { Login } from "./components/Login";
import { ArticleList } from "./components/Articlelist";
import { SingleArticle } from "./components/SingleArticle";
import { AdminMenu } from "./components/AdminMenu";
import { NewPost } from "./components/NewPost";

function App() {
  // console.log(process.env);
  //loginCom = 0 ログインしてない　1:普通ユーザー　2:管理者
  const [loginCom, setLoginCom] = useState(2);
  const [municipality, setMunicipality] = useState("大林町自治区");
  const [municipalityId, setMunicipalityId] = useState("1");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  console.log("loginCom : ", loginCom);

  const menuStyle =
    "m-4 p-4 border-solid rounded-3xl border-4 border-gray-300 text-center md:text-left";
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
          <header className="p-2 bg-gradient-to-b from-blue-500 to-blue-200">
            <p className="text-4xl text-center">{municipality}</p>
            <Link className="homeLink" to="/">
              ホーム
            </Link>
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
                        {/* <span className="items-center justify-center text-6xl md:flex md:flex-row"> */}
                        <div className="items-center justify-center text-6xl sm:flex sm:flex-row">
                          <GrCatalog />
                        </div>
                        <p className="items-center justify-center text-6xl sm:flex sm:flex-row">
                          回覧板
                        </p>
                        {/* </span> */}
                        <p className="mt-2">{`${municipality}からのお知らせです`}</p>
                      </div>
                    </Link>
                    <Link to="https://www.pokemon-card.com/">
                      <div className={menuStyle}>
                        <p className="text-4xl">空項目1</p>
                        <p>説明入れられる？</p>
                      </div>
                    </Link>
                    <Link to="/AttackSearch">
                      <div className={menuStyle}>
                        <p className="text-4xl">空項目2</p>ß
                        <p>説明入れる↑アゲアゲ↑</p>
                      </div>
                    </Link>
                    {loginCom === 2 && (
                      <Link to="/AdminMenu">
                        <div className={menuStyle}>
                          <span className="p-6 text-6xl flex flex-row">
                            <BsFillPencilFill />
                            管理者メニュー
                          </span>
                          <p>{`${municipality}からのお知らせ投稿など`}</p>
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
                  <ArticleList />
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
                    <NewPost />
                  </div>
                }
              />
            )}
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
