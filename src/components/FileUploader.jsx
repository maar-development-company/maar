import React, { useState } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

export const FileUploader = (props) => {
  const { handleDataKey } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Content, setBase64Content] = useState("");
  const [base64Error, setBase64Error] = useState("");
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
          handleDataKey(data.key);
        }
      });
    }
  };

  const handleBase64InputChange = (event) => {
    setBase64Content(event.target.value);
  };

  const handleBase64Submit = () => {
    if (base64Content) {
      try {
        const base64EncodedData = Buffer.from(base64Content, "base64");
        const keyName = "base64_data.txt"; // S3上でのファイル名

        const params = {
          Bucket: bucketName,
          Key: keyName,
          Body: base64EncodedData,
        };

        s3.upload(params, (err, data) => {
          if (err) {
            console.error("S3へのアップロードエラー:", err);
          } else {
            console.log("S3へのアップロードが成功しました:", data.Key);
          }
        });
      } catch (error) {
        setBase64Error("BASE64コードの形式が正しくありません。");
      }
    }
  };

  return (
    <div>
      <h3>ファイルアップロード</h3>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Upload</button>

      <h3>BASE64データ送信</h3>
      <input
        type="text"
        placeholder="BASE64コードを入力"
        value={base64Content}
        onChange={handleBase64InputChange}
      />
      <button onClick={handleBase64Submit}>Submit</button>
      {base64Error && <p style={{ color: "red" }}>{base64Error}</p>}
    </div>
  );
};
