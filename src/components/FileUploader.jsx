import React, { useState } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

export const FileUploader = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const s3 = new AWS.S3();
  const bucketName = "article-area";

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const keyName = selectedFile.name; // S3上でのファイル名
      const fileContent = selectedFile;

      const params = {
        Bucket: bucketName,
        Key: keyName,
        Body: fileContent,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error("S3へのアップロードエラー:", err);
        } else {
          console.log("S3へのアップロードが成功しました:", data.Key);
        }
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};
