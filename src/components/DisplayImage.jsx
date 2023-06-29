import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

export const DisplayImage = (props) => {
  const [imageSource, setImageSource] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "スクリーンショット 2023-06-14 19.14.13.png"
  );

  const s3 = new AWS.S3();
  // const bucketName = "article-area";

  useEffect(() => {
    const getImageFromS3 = async () => {
      const params = {
        Bucket: "article-area",
        Key: imageUrl,
      };

      try {
        const response = await s3.getObject(params).promise();
        const imageBlob = new Blob([response.Body], {
          type: response.ContentType,
        });
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageSource(imageUrl);
      } catch (error) {
        console.error("S3からの画像取得エラー:", error);
      }
    };

    if (imageUrl) {
      getImageFromS3();
    }
  }, [imageUrl]);

  return (
    <div>
      {imageSource ? (
        <img src={imageSource} alt="Uploaded Image" />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};
