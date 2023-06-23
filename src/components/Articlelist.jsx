import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { singleArticle } from "./SingleArticle";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

dayjs.locale(ja);

const now = dayjs().format("YYYY年MM月DD日");

const testArticleList = [
  {
    articleTitleID: 1,
    title: "ごみ収集の日",
    content:
      "今週の火曜日はごみ収集の日です。粗大ゴミは、出さないようにしてください。粗大ゴミは今月末の30日に収集がありますので忘れないようにお願いします。",
    readFlag: 0,
    readTimestamp: "2023/06/21 15:41",
    articleTimestamp: now,
  },
  {
    articleTitleID: 30,
    title: "大林町自治区総会の日",
    content:
      "きたる2023年7月15日は大林町の総会になります。皆様のご意見を集約する日でありますのでご面倒ではございますが、ぜひ大林公民館までお願いいたします。これからの良い町大林をみんなで作っていきましょう。",
    readFlag: 0,
    readTimestamp: "2023/06/21 16:41",
    articleTimestamp: now,
  },
  {
    articleTitleID: 100,
    title: "ゲートボールの大会を開催します！ぜひご参加ください！",
    content:
      "6/29日はゲートボール大会の日です。ゲストでゲートボール日本代表であり、シドニーオリンピックで金メダルをとりました、ボブさんが来てくれます。彼のゲートショットは砂煙が舞い上がるほど強烈なショットだと聞いておりますので、当日はサングラスや保護メガネの準備をお願いいたします。",
    readFlag: 1,
    readTimestamp: "2023/06/21 17:41",
    articleTimestamp: now,
  },
];

export const ArticleList = (props) => {
  const { municipalities } = props;

  // const getArticleList = async () => {

  //データベースにPOSTする処理
  // try {
  //   const res = await fetch(`http://localhost:8080/maar/articlelost?municipalities=${municipalities}`, {
  //     method: "GET",
  //   });
  //   const result = await res.body();
  //   console.log(result);
  //   return result
  // } catch (error) {
  //   console.error(error);
  // }
  // };
  // getArticleList()

  //  [{articleTitleID:☆☆,title:〇〇,content:△△,readflag:0or1,
  //   readTimestamp:2023/06/21/15/41,articleTimestamp:2023/06/21/15/41}......]

  return (
    <div>
      {testArticleList.map((ele) => {
        console.log("");
        return (
          <Link to="/SingleArticle" state={{ articleInfo: ele }}>
            <section className="m-4 p-4 border-solid rounded-3xl border-4 border-gray-300 text-center h-fit">
              <div
                className={
                  ele.readFlag === 0
                    ? "p-1 bg-blue-800 text-gray-100 h-12 rounded-3xl text-3xl text-center w-40 float-right"
                    : "border border-solid border-black h-12 rounded-3xl text-3xl text-center w-40 float-right"
                }
              >
                {ele.readFlag === 0 ? "よんでね" : "よんだ"}
              </div>
              <br></br>
              <br></br>
              <div className="w-full text-left">
                <h2 className="text-3xl">{ele.title}</h2>
                <p className="mt-4">{ele.articleTimestamp}</p>
              </div>
            </section>
          </Link>
        );
      })}
    </div>
  );
};
