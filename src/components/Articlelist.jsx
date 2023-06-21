import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const testArticleList = [
  {
    articleTitleID: 1,
    title: "ごみ収集の日",
    content: "テストおおおおおおおおおお",
    readflag: 0,
    readTimestamp: "2023/06/21 15:41",
    articleTimestamp: "2023/06/21 15:41",
  },
  {
    articleTitleID: 1,
    title: "テストの日",
    content: "テスト2",
    readflag: 0,
    readTimestamp: "2023/06/21 16:41",
    articleTimestamp: "2023/06/21 16:41",
  },
  {
    articleTitleID: 1,
    title: "ゲートボールの日",
    content: "テスト3",
    readflag: 0,
    readTimestamp: "2023/06/21 17:41",
    articleTimestamp: "2023/06/21 17:41",
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
    // <div>
    //   <div>テスト</div>
    // </div>
    <div>
      {testArticleList.map((ele) => {
        console.log("");
        return (
          <div className="link">
            <Link to="https://www.pokemon-card.com/">{ele.title}</Link>
            <div>{ele.articleTimestamp}</div>
            <div>{ele.readflag === 0 ? "未読" : "既読"}</div>
          </div>
        );
      })}
    </div>
  );
};
