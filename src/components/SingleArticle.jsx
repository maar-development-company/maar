import { useLocation } from "react-router-dom";

export const SingleArticle = () => {
  const location = useLocation();
  const { articleInfo } = location.state;

  return (
    <>
      <h1>{articleInfo.articleTitle}</h1>
      <div>{articleInfo.articleContent}</div>
      <p>{articleInfo.articleTimestamp}</p>
    </>
  );
};
