import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

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
		articleInfo
			? articleInfo.fileSavePath
			: "スクリーンショット 2023-06-14 19.14.13.png"
	);
	const [scale, setScale] = useState(1);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [isLoading, setIsLoading] = useState(true);
	const [loadingTimeout, setLoadingTimeout] = useState(null);

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

				const imageBlob = new Blob([response.Body], {
					type: response.ContentType,
				});
				const imageUrl = URL.createObjectURL(imageBlob);
				setImageSource(imageUrl);
				setIsLoading(false);
			} catch (error) {
				console.error("S3からの画像取得エラー:", error);
				setIsLoading(false);
			}
		};

		if (imageUrl) {
			getImageFromS3();
			setIsLoading(true);
			setLoadingTimeout(
				setTimeout(() => {
					setIsLoading(false);
				}, 3000)
			);
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

	useEffect(() => {
		clearTimeout(loadingTimeout);
	}, [loadingTimeout]);

	return (
		<div className="mt-4">
			{isLoading ? (
				<div id="loading-icon"></div>
			) : imageSource ? (
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
                    <Page 
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    customTextRenderer={false}
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                    width={windowWidth} 
                    scale={0.8} 
                    />
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
				<div className="">
					<p className="animate-bounce-top text-gray-700 text-2xl">
						ファイルが正常に登録されておりません
					</p>
				</div>
			)}
		</div>
	);
};
