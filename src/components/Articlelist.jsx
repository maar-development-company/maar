import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { singleArticle } from "./SingleArticle";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://bb-master-revenge-front.onrender.com"
    : "http://localhost:8080";

const testArticleList = [
  {
    articleTitleID: 1,
    title: "ごみ収集の日",
    content: "テストおおおおおおおおおお",
    readFlag: 0,
    readTimestamp: "2023/06/21 15:41",
    articleTimestamp: "2023/06/21 15:41",
  },
  {
    articleTitleID: 30,
    title: "テストの日",
    content: "テスト2",
    readFlag: 0,
    readTimestamp: "2023/06/21 16:41",
    articleTimestamp: "2023/06/21 16:41",
  },
  {
    articleTitleID: 100,
    title: "ゲートボールの日",
    content: "テスト3",
    readFlag: 0,
    readTimestamp: "2023/06/21 17:41",
    articleTimestamp: "2023/06/21 17:41",
  },
];

export const ArticleList = (props) => {
  const { municipalityId, municipality } = props;
  const [ArticleList, setArticleList] = useState([]);
  const [elementsArr, setElementsArr] = useState([]);
  const [ID, setID] = useState(2);

  useEffect(() => {
    getArticleList();
  }, [ArticleList]);

  const getArticleList = async () => {
    //データベースにGETする処理
    try {
      const response = await fetch(
        `${URL}/maar/articlelist?municipalitiesName=${municipality}&householdNameID=${municipalityId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch.");
      }
      const articleObj = await response.json();
      console.log(articleObj);
      if (articleObj.length !== ArticleList.length) {
        setArticleList(articleObj);
      }
    } catch (error) {
      console.error(error);
    }
  };
  getArticleList();

  return (
    <>
      <div>
        <button
          onClick={getArticleList}
          className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56"
        >
          更新
        </button>
      </div>
      <div>
        {ArticleList.map((ele) => {
          console.log("");
          return (
            <Link to="/SingleArticle" state={{ articleInfo: ele }}>
              <section className="m-4 p-4 h-44  border-solid rounded-3xl border-4 border-gray-300 text-center flex flex-row">
                <div className="w-10/12 text-left">
                  <h2 className="text-3xl">{ele.articleTitle}</h2>
                  <p className="mt-4">{ele.articleTimestamp}</p>
                </div>
                <div className="">{ele.readFlag === 0 ? "未読" : "既読"}</div>
              </section>
            </Link>
          );
        })}
      </div>
    </>
  );
};
