import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Login } from "./components/Login";
import { ArticleList } from "./components/Articlelist";

function App() {
  // console.log(process.env);
  const [loginCom, setLoginCom] = useState(1);
  const [municipality, setMunicipality] = useState("");
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
                      <Link to="https://www.pokemon-card.com/">
                        遊び方と<br></br>大会ルール
                      </Link>
                    </div>
                    <div className="link">
                      <Link to="https://www.pokemon-card.com/">商品情報</Link>
                    </div>
                    <div className="link">
                      <Link to="https://www.pokemon-card.com/">イベント</Link>
                    </div>
                    <div className="link">
                      <Link to="https://www.pokemon-card.com/">お店検索</Link>
                    </div>
                    <div className="link">
                      <Link to="https://www.pokemon-card.com/">カード検索</Link>
                    </div>
                    <div className="link">
                      <Link to="https://www.pokemon-card.com/">デッキ構築</Link>
                    </div>
                    <div className="link">
                      <Link to="/AttackSearch">技検</Link>
                    </div>
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
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
