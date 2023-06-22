import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Login } from "./components/Login";
import { ArticleList } from "./components/Articlelist";
import { SingleArticle } from "./components/SingleArticle";
import { AdminMenu } from "./components/AdminMenu";
import { NewPost } from "./components/NewPost";

function App() {
  // console.log(process.env);
  const [loginCom, setLoginCom] = useState(2);
  const [municipality, setMunicipality] = useState("大林町");
  const [municipalityId, setMunicipalityId] = useState("1");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  console.log("loginCom : ", loginCom);

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
          <header>CPU町内会</header>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="HomeButton">
                    <Link className="homeLink" to="/">
                      ホーム
                    </Link>
                  </div>
                  <div className="link-container">
                    <div className="link">
                      <Link to="/articlelist">お知らせ</Link>
                    </div>
                    <div className="link">
                      <Link to="https://www.pokemon-card.com/">デッキ構築</Link>
                    </div>
                    <div className="link">
                      <Link to="/AttackSearch">技検</Link>
                    </div>
                    {loginCom === 2 && (
                      <div className="link">
                        <Link to="/AdminMenu">管理者メニュー</Link>
                      </div>
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
