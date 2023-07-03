import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

export const DisplayImage = (props) => {
  const { articleInfo } = props;  
  console.log("これが空だと俺のカード表示" ,articleInfo)

  const [imageSource, setImageSource] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  console.log('isPdf: ', isPdf);
  const [imageUrl, setImageUrl] = useState(
    articleInfo ? articleInfo.fileSavePath:  "スクリーンショット 2023-06-14 19.14.13.png"
  );

  // console.log("imageUrl1 :" ,imageUrl);
  const s3 = new AWS.S3();
  // const bucketName = "article-area";
  // console.log("imageUrl2 :" ,imageUrl);
  useEffect(() => {
    // console.log("imageUrl3 :" ,imageUrl);
    const getImageFromS3 = async () => {
      const params = {
        Bucket: "article-area",
        Key: imageUrl,
      };
      // console.log('params.Bucket: ', params.Bucket);
      // console.log("imageUrl4 :" ,imageUrl);
      try {
        // console.log("imageUrl5 :" ,imageUrl);
        const response = await s3.getObject(params).promise();
        // console.log("imageUrl6 :" ,imageUrl);
        setIsPdf(response.ContentType === "application/pdf");
        // console.log('imageUrl7: ', imageUrl);
        // console.log('response.ContentType: ', response.ContentType);
        // console.log('isPdf:
        
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
        isPdf ? (
          <embed src={imageSource} type="application/pdf" width="100%" height="600px" />
          ) : (
          <img src={imageSource} alt="Uploaded Image" />
          )
        ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};