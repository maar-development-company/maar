import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

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
    <div className="text-center">
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
      <h1 className="sm:text-6xl text-4xl title-font font-medium text-gray-900 mt-4 mb-4">
        新規お知らせ投稿
      </h1>
      <input
        className="w-11/12 h-full bg-gray-100 bg-opacity-50 rounded border
        mt-4 ml-2 mr-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 outline-none text-gray-700 text-4xl
           py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        type="text"
        placeholder="記事タイトル"
        onChange={handleArticleTitleChange}
        required
      />
      <br></br>
      <textarea
        className="w-11/12  bg-gray-100 bg-opacity-50 rounded border 
        mt-4 ml-2 mr-2 mb-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 h-64 outline-none text-gray-700 text-4xl 
          py-1 px-3 resize-none transition-colors duration-200 ease-in-out leading-relaxed"
        placeholder="記事内容を&#13;入力してください"
        onChange={handleArticleContentChange}
        required
      />
      <br></br>
      <br></br>
      <label className="p-1 bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56 cursor-pointer text-3xl">
        ファイルを選択
        <input
          className="hidden"
          type="file"
          // onchange={`$("#fake_text_box").val($(this).val())`}
        ></input>
        {/* <input
          value=""
          readOnly="readonly"
          id="fake_text_box"
          className=""
          onClick={`$('#file').click()`}
        ></input> */}
      </label>
      <br></br>
      <br></br>
      <div>
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56 mt-2 text-3xl "
          onClick={postArticle}
        >
          新規投稿
        </button>
      </div>
      <br></br>
    </div>
  );
};
