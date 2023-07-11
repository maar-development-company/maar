import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FileUploader } from "./FileUploader";
import { TakePicture2 } from "./TakePicture2";
import { init, send } from "@emailjs/browser";

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

//PC or Mobileを判定する。
const isMobileDevice = () => {
  const userAgent = navigator.userAgent;
  // console.log(userAgent);
  const mobileDeviceRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileDeviceRegex.test(userAgent);
};

export const NewPost = (props) => {
  const location = useLocation();
  const { municipality, id, userName } = location.state;
  const [postArticleTitle, setPostArticleTitle] = useState("");
  const [postArticleContent, setPostArticleContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [DataKey, setDataKey] = useState("");
  const [flag, setFlag] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const s3 = new AWS.S3();
  const bucketName = "article-area";

  const handleArticleTitleChange = (e) => {
    setPostArticleTitle(e.target.value);
  };

  const handleArticleContentChange = (e) => {
    setPostArticleContent(e.target.value);
  };

  async function postArticle() {
    const formattedTimestamp = dayjs();
    if (postArticleTitle === "" || postArticleContent === "") {
      return;
    }

    try {
      const data = {
        articleTitle: postArticleTitle,
        articleContent: postArticleContent,
        municipalitiesName: municipality,
        articleTimestamp: formattedTimestamp,
        articleCategory: "安全",
        fileSavePath: DataKey,
      };
      // console.log("### data ###: ", data);

      const res = await fetch(`${URL}/maar/articlelist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.text();
      // console.log(result);
      if (result === "新しい記事を追加しました。") {
        setPostArticleTitle("");
        setPostArticleContent("");
        setIsUploading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMailArticle() {
    if (postArticleTitle === "" || postArticleContent === "") {
      return;
    }
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
    // console.log(municipalitiesName);
    try {
      init("5NfbwG0M_nIl2or7_");
      const params = {
        userEmail: emailAddressString,
        municipality: municipalitiesName,
        articleTitle: postArticleTitle,
        articleContent: postArticleContent,
        url: mailUrl,
      };
      // console.log("### params ###: ", params);

      await send(serviceID, templateID, params);
      console.log("投稿通知送信成功");
    } catch (error) {
      // 送信失敗したらalertで表示
      console.log("投稿通知送信失敗");
    }
  }

  const handleUpload = () => {
    // console.log("selectedFile:", selectedFile);
    // console.log("selectedFile type:", typeof selectedFile);
    // console.log("selectedFile name:", selectedFile?.name);
    if (!selectedFile) {
      console.log("ファイルが選択されていません");
      handleDataKey("");
      return;
    }

    const time = dayjs().format("YYYYMMDDhhmmss");
    console.log(time);
    const pictureFileName = userName + time;

    const keyName = selectedFile.name ? selectedFile.name : pictureFileName; // S3上でのファイル名
    const fileContent = selectedFile;
    // console.log('selectedFile.type: ', selectedFile.type);

    // ContentTypeを設定
    let contentType;
    if (keyName.endsWith(".pdf")) {
      contentType = "application/pdf";
    } else if (selectedFile && selectedFile.type) {
      contentType = selectedFile.type;
    } else {
      contentType = "application/octet-stream";
    }

    const params = {
      Bucket: bucketName,
      Key: keyName,
      Body: fileContent,
      // ContentType: contentType
      ContentType: selectedFile.type,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("S3へのアップロードエラー:", err);
      } else {
        console.log("S3へのアップロードが成功しました:", data.key);
        handleDataKey(data.key);
        return "S3へのアップロードが成功しました";
      }
    });
  };

  const postAndClearInput = async () => {
    if (postArticleTitle === "" || postArticleContent === "") {
      window.alert("記事タイトルと記事が入力されていません");
      return;
    }
    setIsUploading(true);
    try {
      await handleUpload();
    } catch (error) {
      console.error("アップロードエラー：", error);
    }
  };

  const handleDataKey = async (e) => {
    console.log("e: ", e);
    setDataKey(e);
    setFlag(!flag);
  };

  useEffect(() => {
    postArticle();
    sendMailArticle();
  }, [flag]);

  return (
    <div className="text-center overflow-y-auto fixed top-24 bottom-14 right-0 left-0">
      <h1 className="sm:text-6xl text-4xl title-font font-medium text-gray-900 mt-4 mb-4">
        お知らせ新規投稿
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
      <textarea
        className="w-11/12  bg-gray-100 bg-opacity-50 rounded border 
        mt-4 ml-2 mr-2 mb-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 h-64 outline-none text-gray-700 text-4xl 
          py-1 px-3 resize-none transition-colors duration-200 ease-in-out leading-relaxed"
        placeholder="記事内容を&#13;入力してください"
        onChange={handleArticleContentChange}
        required
        value={postArticleContent}
      />
      <br></br>
      <FileUploader
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleUpload={handleUpload}
        userName={userName}
        handleDataKey={handleDataKey}
      />
      {isMobileDevice() || (
        <TakePicture2
          userName={userName}
          handleDataKey={handleDataKey}
          isMobileDevice={isMobileDevice}
          postAndClearInput={postAndClearInput}
        />
      )}
      {/* <PictureFileUploader handleDataKey={handleDataKey} /> */}
      <br></br>
      <br></br>
      {isUploading ? (
        <div id="uploading-icon"></div>
      ) : (
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
      )}
      <br></br>
    </div>
  );
};
