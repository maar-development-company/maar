import React, { useState, useEffect, useRef } from "react";
import * as AWS from "aws-sdk";
import dayjs from "dayjs";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

export function TakePicture2(props) {
  const { onData, userName, handleDataKey } = props;
  const [result, setResult] = useState("");
  const [cameraStarted, setCameraStarted] = useState(false);
  const [captureDate, setCaptureDate] = useState("");
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const [reserveDetect, setReserveDetect] = useState(false);
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
            const time = dayjs().format("YYYYMMDDhhmmss");
            console.log(time);
            const fileName = userName + time;
            const keyName = `${fileName}.jpg`; // S3上でのファイル名

            const params = {
              Bucket: bucketName,
              Key: keyName,
              Body: blob,
              ContentType: "image/jpeg",
            };
            setCaptureDate(params);
            const imageUrl = URL.createObjectURL(params.Body);
            setCapturedImageUrl(imageUrl);
            setReserveDetect(true);
          });
        } catch (error) {
          console.error("画像の変換エラー:", error);
        }
      }
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
      setCameraStarted(true);
      startCamera();
    }
  };

  const reserveCapture = async () => {
    if (reserveDetect) {
      try {
        s3.upload(captureDate, (err, data) => {
          if (err) {
            console.error("S3へのアップロードエラー:", err);
          } else {
            console.log("S3へのアップロードが成功しました:", data.Key);
            handleDataKey(data.Key);
          }
        });
      } catch (error) {
        console.error("画像の変換エラー:", error);
      }
    }
    setReserveDetect(false);
  };

  return (
    <>
      <div>
        {cameraStarted && (
          <video
            className="w-screen flex justify-center items-center"
            ref={videoRef}
            autoPlay
          />
        )}
      </div>
      <button
        className="bg-blue-800 text-center hover:bg-blue-700 text-white rounded px-4 py-2 w-56 mt-2 text-3xl "
        onClick={toggleCamera}
      >
        {cameraStarted ? "撮影" : "カメラ起動"}
      </button>
      {capturedImageUrl && (
        <img
          className="w-screen flex justify-center items-center"
          src={capturedImageUrl}
          alt="Captured Image"
        />
      )}
      {reserveDetect && (
        <button
          className="bg-blue-800 text-center hover:bg-blue-700 text-white rounded px-4 py-2 w-56 mt-2 text-3xl "
          onClick={reserveCapture}
        >
          画像送信
        </button>
      )}
    </>
  );
}
