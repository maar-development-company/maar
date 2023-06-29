import React, { useState, useEffect, useRef } from "react";
// import "../styles/CameraComponent.css";

export function TakePicture(props) {
  const { onData } = props;
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

      // ここで画像のデータを保存する処理を実装します
      // 例えば、APIリクエストや画像の保存処理を実行します

      console.log("キャプチャした画像データ:", dataURL);
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
