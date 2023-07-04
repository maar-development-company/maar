import React, { useState, useEffect, useRef } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

// import "../styles/CameraComponent.css";

export function TakePicture2old(props) {
  const { onData, handleDataKey } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Content, setBase64Content] = useState("");
  const [base64Error, setBase64Error] = useState("");
  const s3 = new AWS.S3();
  const bucketName = "article-area";

  const [result, setResult] = useState("");
  const [cameraStarted, setCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

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

      const dataURL = canvas.toDataURL("image/jpeg");

      setBase64Content(dataURL);

      // ここで画像のデータを保存する処理を実装します
      // 例えば、APIリクエストや画像の保存処理を実行します

      console.log("キャプチャした画像データ:", dataURL);
    }
  };

  //下記より画像を保存するコード

  //captureImageに移動　開始
  // const handleBase64InputChange = (event) => {
  //   setBase64Content(event.target.value);
  // };
  //移動終わり

  const handleBase64Submit = () => {
    if (base64Content) {
      try {
        console.log(111);
        const base64EncodedData = Buffer.from(base64Content, "base64");
        const keyName = "base64_data.txt"; // S3上でのファイル名
        console.log(222);
        const params = {
          Bucket: bucketName,
          Key: keyName,
          Body: base64EncodedData,
        };

        console.log(params);

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
      {/* <div className="buttonContain">
        <input placeholder="読み取り結果" value={result} />
        <button className="picSendData">データ登録</button>
      </div> */}
      <div>
        {/* データを送信するコード */}
        <h3>BASE64データ送信</h3>
        {/* <input
        type="text"
        placeholder="BASE64コードを入力"
        value={base64Content}
        onChange={handleBase64InputChange}
      /> */}
        <button onClick={handleBase64Submit}>Submit</button>
        {base64Error && <p style={{ color: "red" }}>{base64Error}</p>}
      </div>
    </>
  );
}
