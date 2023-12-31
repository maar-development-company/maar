import React, { useState } from "react";
import AWS from "aws-sdk";
import pica from "pica";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

export const FileUploader = (props) => {
  const {
    selectedFile,
    setSelectedFile,
    handleUpload,
    userName,
    handleDataKey,
  } = props;

  const isImageFile = (file) => {
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && isImageFile(file)) {
      console.log("画像が選択された");
      const image = new Image();
      image.src = URL.createObjectURL(file);
      const resizeFile = await resizeImage(image);
      setSelectedFile(resizeFile);
    } else {
      console.log("画像以外が選択された");
      setSelectedFile(file);
    }
  };

  //ファイルを選択の中にある「写真またはビデオを撮る」を利用して写真を撮影しリサイズを行ってアップロードする。
  const resizeImage = async (image) => {
    console.log("resizeImageが発動");
    const loadPromise = new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject; // 画像の読み込みが失敗した場合のエラーハンドリング
    });

    // 画像の読み込みを待機
    await loadPromise;
    console.log("resizeImageが終了？");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let targetWidth = 0;
    let targetHeight = 0;

    if (image.width > image.height) {
      targetWidth = 600;
      targetHeight = (image.height / image.width) * targetWidth;
    } else {
      targetHeight = 600;
      targetWidth = (image.width / image.height) * targetHeight;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    await pica().resize(image, canvas, { quality: 3 });

    return new Promise((resolve) => {
      console.log("blobまで到達1");
      canvas.toBlob(
        (blob) => {
          console.log("blobまで到達2");
          resolve(blob);
        },
        selectedFile && selectedFile.type ? selectedFile.type : undefined,
        0.9
      );
    });
  };

  return (
    <div>
      <h3 className="text-3xl">ファイルアップロード</h3>
      <input className="text-3xl" type="file" onChange={handleFileSelect} />
      {/* <button
        className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56 mt-2 text-3xl"
        onClick={handleUpload}
      >
        Upload
      </button> */}
    </div>
  );
};
