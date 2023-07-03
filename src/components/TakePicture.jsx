import React, { useState, useEffect, useRef } from "react";
import * as AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

export function TakePicture(props) {
  const { onData } = props;
  const [result, setResult] = useState("");
  const [cameraStarted, setCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const s3 = new AWS.S3();
  const bucketName = "article-area";

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setCameraStarted(true);
      console.log("カメラ起動しました。");
    } catch (error) {
      console.error("カメラの起動に失敗しました。", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      streamRef.current = null;
      setCameraStarted(false);
      console.log("カメラ停止しました。");
    }
  };

  const toggleCamera = () => {
    if (cameraStarted) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const captureImage = async () => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      context.drawImage(
        videoElement,
        0,
        0,
        videoElement.videoWidth,
        videoElement.videoHeight
      );

      try {
        canvas.toBlob(async (blob) => {
          const keyName = "image.jpg"; // S3上でのファイル名

          const params = {
            Bucket: bucketName,
            Key: keyName,
            Body: blob,
            ContentType: "image/jpeg",
          };

          s3.upload(params, (err, data) => {
            if (err) {
              console.error("S3へのアップロードエラー:", err);
            } else {
              console.log("S3へのアップロードが成功しました:", data.Key);
            }
          });
        }, "image/jpeg");
      } catch (error) {
        console.error("画像の変換エラー:", error);
      }
    }
  };

  return (
    <>
      <div>
        <video ref={videoRef} autoPlay />
      </div>
      <div className="cameraButton">
        <button onClick={toggleCamera}>
          {cameraStarted ? "カメラ停止" : "カメラ起動"}
        </button>
      </div>
      <div className="sendButton">
        <button onClick={captureImage}>画像送信</button>
      </div>
      <div className="buttonContain">
        <input placeholder="読み取り結果" value={result} />
        <button className="picSendData">データ登録</button>
      </div>
    </>
  );
}
