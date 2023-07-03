import React from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { DisplayImage } from "./DisplayImage";

export const SingleArticle = () => {
  const location = useLocation();
  const { articleInfo } = location.state;
  console.log("articleInfoの中身", articleInfo);
  return (
    <>
      <div className="m-4 p-1 h-fit bg-gradient-to-b from-gray-400 to-gray-200 md:h-fit rounded-3xl text-3xl md:flex md:flex-col">
        <div className="m-1 p-2 h-fit bg-gray-50 md:h-fit border-solid rounded-2xl text-3xl">
          <h1>{articleInfo.articleTitle}</h1>
        </div>
        <div className="m-1 mt-3 p-2 h-fit bg-gray-50 md:h-fit border-solid rounded-2xl text-3xl">
          {articleInfo.articleContent.split("\n").map((text, index) => (
            <React.Fragment key={index}>
              {text}
              <br />
            </React.Fragment>
          ))}
          <DisplayImage articleInfo={articleInfo} />
        </div>
        <p className="mr-4 text-2xl text-right">
          配信日時：
          {dayjs(articleInfo.articleTimestamp).format("YYYY年MM月DD日HH時mm分")}
        </p>
      </div>
    </>
  );
};
