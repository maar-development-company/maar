// export const Article = (props) => {
//   return (
//     <div>
//       <h1>Hello World</h1>
//     </div>
//   );
// };
import { useLocation } from "react-router-dom";

export const SingleArticle = () => {
  const location = useLocation();
  const { articleInfo } = location.state;

  return (
    <>
      <h1>{articleInfo.title}</h1>
      <div>{articleInfo.content}</div>
      <p>{articleInfo.articleTimestamp}</p>
    </>
  );
};
