import { Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { singleArticle } from "./SingleArticle";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

dayjs.locale(ja);

const now = dayjs().format("YYYY年MM月DD日");
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://maar-front.onrender.com"
    : "http://localhost:8080";

export const SurveyList = (props) => {
  const { municipalityId, municipality } = props;
  const [ArticleList, setArticleList] = useState([]);
  const [elementsArr, setElementsArr] = useState([]);
  const [ID, setID] = useState(2);
  const [number, setNumber] = useState("");
  const [surveyUrl, setSurveyUrl] = useState("");
  const location = useLocation();
  const { user } = location.state;
  let userId;
  const [imagePath, setImagePath] = useState("");
  useEffect(() => {
    getArticleList();
  }, [number]);

  const writeToSessionStorage = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };
  const readFromSessionStorage = (key) => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  const getArticleList = async () => {
    //データベースにGETする処理
    // console.log(municipality);
    const encodedMunicipality = encodeURIComponent(municipality);
    const encodedhouseholdNameID =
      readFromSessionStorage("loginResultInfo").houseHoldNameID;

    // console.log(
    //   "ちぇっくしたいやつ",
    //   readFromSessionStorage("loginResultInfo").houseHoldNameID
    // );
    userId = readFromSessionStorage("loginResultInfo").houseHoldNameID;
    try {
      const response = await fetch(
        `${URL}/maar/articlelist?municipalitiesName=${encodedMunicipality}&householdNameID=${encodedhouseholdNameID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch.");
      }
      const articleObj = await response.json();
      setNumber(articleObj.length);
      // console.log(articleObj);
      // ★householdID = 2のuserの最新記事（配列[0]）の既読日時の取り方
      // ★articleObjの要素１つ（↓だと[0]）のuseReadInfoプロパティをJSON.parseする
      // let householdID = 2;
      // console.log(
      // 	"articleObj.userReadInfo : ",
      // 	JSON.parse(articleObj[0].userReadInfo)[String(householdID)]
      // );
      if (articleObj.length !== ArticleList.length) {
        setArticleList(articleObj);
      }
    } catch (error) {
      console.error(error);
    }
  };
  getArticleList();

  const articleOnClickHandler = async (articleId) => {
    // 既読日時を取得・変数宣言
    const currentDate = new Date();
    const readTimestamp = dayjs(currentDate).format("YYYY年MM月DD日HH時mm分");

    try {
      const data = {
        user,
        readTimestamp,
        articleId,
      };
      // console.log(data);

      const res = await fetch(`${URL}/maar/articlelist`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      // console.log(result);

      // userIdを変数に格納
      // console.log(result.userId);
      userId = result.userId;
      // console.log("userId : ", userId, typeof userId);
    } catch (error) {
      console.error(error);
    }
  };

  const moveSurveyOpen = () => {
    window.open(e.target.value);
  };

  return (
    <div className="overflow-y-auto fixed top-24 bottom-12 right-0 left-0">
      <div>
        <button
          onClick={getArticleList}
          className="bg-blue-800 border-2 border-white hover:bg-blue-700 text-white rounded px-4 py-2 w-fit fixed top-2 right-2"
        >
          一覧更新
        </button>
      </div>
      {ArticleList.map((ele) => {
        if (ele.articleCategory === "アンケート") {
          // console.log("ele : ", ele);
          let contentBeginning;
          const articleId = ele.id;
          const textContent = ele.articleContent;
          if (textContent.length > 20) {
            // 表示したい字数を決めたら変更する（現在：「20」）
            contentBeginning = `${textContent.substr(0, 20)}...`; // 表示したい字数を決めたら変更する（現在：「20」）
          } else {
            contentBeginning = textContent;
          }
          const isRead = JSON.parse(ele.userReadInfo)[String(userId)];
          return (
            <a href={ele.articleContent} target="_blank">
              <section
                onClick={() => {
                  if (
                    JSON.parse(ele.userReadInfo)[String(userId)] === undefined
                  ) {
                    articleOnClickHandler(articleId);
                  }
                }}
                className="shadow-lg m-4 p-4 border-solid rounded-3xl border bg-gray-100 hover:bg-gray-200 border-gray-300 text-center h-fit"
              >
                <div
                  className={
                    // ele.readFlag === 0
                    JSON.parse(ele.userReadInfo)[String(userId)] !== undefined
                      ? "p-1 border border-solid border-gray-300 h-12 rounded-3xl text-3xl text-center text-gray-700 w-40 float-right"
                      : "p-1 bg-blue-800 text-gray-100 h-12 rounded-3xl text-3xl text-center w-40 float-right"
                  }
                >
                  {JSON.parse(ele.userReadInfo)[String(userId)] !== undefined
                    ? "よんだ"
                    : "よんでね"}
                  {/* {ele.readFlag === 0 ? "よんでね" : "よんだ"} */}
                </div>
                <br></br>
                <div className="w-full text-left text-3xl">
                  {/* <button
                    className="text-3xl"
                    type="button"
                    onClick={moveSurvey(ele.articleContent)}
                  > */}
                  {ele.articleTitle}
                  {/* </button> */}
                  <p className="mt-4">
                    {dayjs(ele.articleTimestamp).format("YYYY年MM月DD日")}
                  </p>
                </div>
              </section>
            </a>
          );
        }
      })}
    </div>
  );
};
