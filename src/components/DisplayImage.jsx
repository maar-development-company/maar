
// PDF表示をreact-pdfに変更
import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

AWS.config.update({
	accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
	secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
	region: "us-east-1",
});

export const DisplayImage = (props) => {
  const { articleInfo } = props;
	console.log("これが空だと俺のカード表示", articleInfo);
  const [imageSource, setImageSource] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    articleInfo ? articleInfo.fileSavePath : "スクリーンショット 2023-06-14 19.14.13.png"
  );
  const [scale, setScale] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const s3 = new AWS.S3();

  useEffect(() => {
    const getImageFromS3 = async () => {
      const params = {
        Bucket: "article-area",
        Key: imageUrl,
      };
      try {
        const response = await s3.getObject(params).promise();
        setIsPdf(response.ContentType === "application/pdf");

        const imageBlob = new Blob([response.Body], { type: response.ContentType });
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
  
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
		<div className="mt-4">
      {imageSource ? (
        isPdf ? (
          <TransformWrapper>
            <TransformComponent>
              <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
                <Document
                  file={imageSource}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading="Loading PDF..."
                  error="Error loading PDF"
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} width={windowWidth} scale={0.8} />
                  ))}
                </Document>
              </div>
            </TransformComponent>
          </TransformWrapper>
        ) : (
          <a href={imageSource} data-lightbox="group">
            <img src={imageSource} width="300" alt="Uploaded Image" />
          </a>
        )
      ) : (
				<div id="loading-icon"></div>
      )}
    </div>
  );
};
