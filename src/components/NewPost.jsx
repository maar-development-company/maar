import { useLocation } from "react-router-dom";

export const NewPost = () => {
  const location = useLocation();
  const { municipality, id } = location.state;

  let postArticleTitle;
  let postArticleContent;

  const handleArticleTitleChange = (e) => {
    // console.log(e.target.value);
    postArticleTitle = e.target.value;
    // console.log(postArticleTitle);
  };

  const handleArticleContentChange = (e) => {
    // console.log(e.target.value);
    postArticleContent = e.target.value;
    // console.log(postArticleContent);
  };

  {
    /* <投稿作成>
POST:{title:〇〇,content:△△,
municipalities:地域名,
articleTimestamp:2023/06/21/15/41}
→ステータスコードのみ */
  }

  async function postArticle() {
    try {
      const data = {
        title: postArticleTitle,
        content: postArticleContent,
        municipalityId: id,
        articleTimestamp: new Date(),
      };
      const res = await fetch(
        `http://localhost:8080/maar/articlelist?municipalities=${municipality}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await res.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>{municipality}</h1>
      <input
        className="postArticleTitle"
        type="text"
        placeholder="記事タイトルを入力してください。"
        onChange={handleArticleTitleChange}
        required
      />
      <br></br>
      <textarea
        className="postArticleContent"
        placeholder="記事内容を入力してください。"
        onChange={handleArticleContentChange}
        required
      />
      <br></br>
      <button onClick={postArticle}>新規投稿</button>
    </>
  );
};
