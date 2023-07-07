import dayjs from "dayjs";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { init, send } from "@emailjs/browser";
// import { isUrl } from "is-url";

// 必要なIDをそれぞれ環境変数から取得
const userID = process.env.REACT_APP_USER_ID;
const serviceID = process.env.REACT_APP_SERVICE_ID;
const templateID = process.env.REACT_APP_TEMPLATE_ID;

const URL =
  process.env.NODE_ENV === "production"
    ? "https://maar-front.onrender.com"
    : "http://localhost:8080";

const mailUrl =
  process.env.NODE_ENV === "production"
    ? "https://main.d3qoybvs7295uz.amplifyapp.com/"
    : "http://localhost:3000";

export const NewSurveyPost = (props) => {
  const location = useLocation();
  const { municipality, id, userName } = location.state;
  const [postArticleTitle, setPostArticleTitle] = useState("");
  const [postArticleContent, setPostArticleContent] = useState("");
  const [DataKey, setDataKey] = useState("");

  const handleArticleTitleChange = (e) => {
    setPostArticleTitle(e.target.value);
  };

  const handleArticleContentChange = (e) => {
    setPostArticleContent(e.target.value);
  };

  const checkContent = (content) => {
    if (content === undefined) {
      return false;
    } else if (content === "") {
      return false;
    } else {
      return true;
    }
  };

  async function postArticle() {
    if (!checkContent(postArticleContent)) {
      return window.alert("コンテンツを入力してください。");
    }
    if (!checkContent(postArticleTitle)) {
      return window.alert("タイトルを入力してください。");
    }
    const formattedTimestamp = dayjs();
    try {
      const data = {
        articleTitle: postArticleTitle,
        articleContent: postArticleContent,
        municipalitiesName: municipality,
        articleTimestamp: formattedTimestamp,
        articleCategory: "アンケート",
        fileSavePath: DataKey,
      };
      console.log("### data ###: ", data);

      const res = await fetch(`${URL}/maar/articlelist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMailArticle() {
    const loginResultInfo = sessionStorage.getItem("loginResultInfo");
    const municipalitiesName = JSON.parse(loginResultInfo).municipalitiesName;
    const encodedParam = encodeURIComponent(municipalitiesName);
    let emailAddressString = "";
    try {
      const response = await fetch(`${URL}/maar/mailaddress/${encodedParam}`);
      if (!response.ok) {
        throw new Error("Failed to fetch.");
      }
      const emailadressArrObj = await response.json();
      emailadressArrObj.forEach((element) => {
        emailAddressString = emailAddressString + "," + element.householdMail;
      });
      emailAddressString = emailAddressString.slice(1);
      // emailAddressString = "tomohiro_kuba@mail.toyota.co.jp";
      // console.log(emailAddressString);
    } catch (error) {
      console.error(error);
    }
    console.log(municipalitiesName);
    try {
      init("5NfbwG0M_nIl2or7_");
      const params = {
        userEmail: emailAddressString,
        municipality: municipalitiesName,
        articleTitle: postArticleTitle,
        articleContent: postArticleContent,
        url: mailUrl,
      };
      console.log("### params ###: ", params);

      await send(serviceID, templateID, params);
      console.log("投稿通知送信成功");
    } catch (error) {
      // 送信失敗したらalertで表示
      console.log("投稿通知送信失敗");
    }
  }

  const postAndClearInput = () => {
    postArticle();
    sendMailArticle();
    setPostArticleTitle("");
    setPostArticleContent("");
  };

  const handleDataKey = (e) => {
    console.log("e: ", e);
    setDataKey(e);
  };

  const moveSurvey = () => {
    window.open("https://www.google.com/intl/ja_jp/forms/about/");
  };

  return (
    <div className="text-center overflow-y-auto fixed top-24 bottom-14 right-0 left-0">
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
      <h1 className="sm:text-6xl text-4xl title-font font-medium text-gray-900 mt-4 mb-4">
        新規アンケート投稿
      </h1>
      <input
        className="w-11/12 h-20 bg-gray-100 bg-opacity-50 rounded border
        mt-4 ml-2 mr-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 outline-none text-gray-700 text-4xl
           py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        type="text"
        placeholder="記事タイトル"
        onChange={handleArticleTitleChange}
        required
        value={postArticleTitle}
      />
      <br></br>
      <input
        className="w-11/12  bg-gray-100 bg-opacity-50 rounded border 
        mt-4 ml-2 mr-2 mb-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 h-64 outline-none text-gray-700 text-4xl 
          py-1 px-3 resize-none transition-colors duration-200 ease-in-out leading-relaxed"
        placeholder="アンケートの&#13;URLを入力&#13;してください"
        onChange={handleArticleContentChange}
        required
        type="url"
        value={postArticleContent}
      />
      <div>
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56 mt-2 text-3xl "
          onClick={moveSurvey}
        >
          Google form作成
        </button>
      </div>
      <div>
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56 mt-2 text-3xl "
          onClick={postAndClearInput}
          // onClick={sendMailArticle}
          value=""
        >
          新規投稿
        </button>
      </div>
      {/* <link to="https://www.google.com/intl/ja_jp/forms/about/">
        アンケート
      </link> */}
      <br></br>
    </div>
  );
};

// googleformのURL
// https://docs.google.com/forms/d/e/1FAIpQLSfrPSbvO9cnHFvL9k4yfFJQLXgBgNQtrfYiABUWP7xs7teakw/viewform?usp=sf_link
// https://forms.gle/AnBZtd3Ur3xUA4LP8
