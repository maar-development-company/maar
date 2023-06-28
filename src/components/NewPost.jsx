import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const URL =
	process.env.NODE_ENV === "production"
		? "https://maar-front.onrender.com"
		: "http://localhost:8080";

export const NewPost = () => {
	const location = useLocation();
	const { municipality, id } = location.state;
	const [postArticleTitle, setPostArticleTitle] = useState("");
	const [postArticleContent, setPostArticleContent] = useState("");

	const handleArticleTitleChange = (e) => {
		setPostArticleTitle(e.target.value);
	};

	const handleArticleContentChange = (e) => {
		setPostArticleContent(e.target.value);
	};

	async function postArticle() {
		const currentDate = new Date();

		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, "0");
		const day = String(currentDate.getDate()).padStart(2, "0");
		const hour = String(currentDate.getHours()).padStart(2, "0");
		const minute = String(currentDate.getMinutes()).padStart(2, "0");
		const second = String(currentDate.getSeconds()).padStart(2, "0");

		const formattedTimestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

		try {
			const data = {
				articleTitle: postArticleTitle,
				articleContent: postArticleContent,
				municipalitiesName: municipality,
				articleTimestamp: formattedTimestamp,
				articleCategory: "安全",
			};
			console.log(data);

			const res = await fetch(`${URL}/maar/articlelist`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const result = await res.text();
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	}
	const postAndClearInput = () => {
		postArticle();
		setPostArticleTitle("");
		setPostArticleContent("");
	};

	return (
		<div className="text-center">
			{/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> */}
			<h1 className="sm:text-6xl text-4xl title-font font-medium text-gray-900 mt-4 mb-4">
				新規お知らせ投稿
			</h1>
			<input
				className="w-11/12 h-full bg-gray-100 bg-opacity-50 rounded border
        mt-4 ml-2 mr-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 outline-none text-gray-700 text-4xl
           py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
				type="text"
				placeholder="記事タイトル"
				onChange={handleArticleTitleChange}
				required
				value={postArticleTitle}
			/>
			<br></br>
			<textarea
				className="w-11/12  bg-gray-100 bg-opacity-50 rounded border 
        mt-4 ml-2 mr-2 mb-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 h-64 outline-none text-gray-700 text-4xl 
          py-1 px-3 resize-none transition-colors duration-200 ease-in-out leading-relaxed"
				placeholder="記事内容を&#13;入力してください"
				onChange={handleArticleContentChange}
				required
				value={postArticleContent}
			/>
			<br></br>
			<br></br>
			<label className="p-1 bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56 cursor-pointer text-3xl">
				ファイルを選択
				<input
					className="hidden"
					type="file"
					// onchange={`$("#fake_text_box").val($(this).val())`}
				></input>
				{/* <input
            value=""
            readOnly="readonly"
            id="fake_text_box"
            className=""
            onClick={`$('#file').click()`}
          ></input> */}
			</label>
			<br></br>
			<br></br>
			<div>
				<button
					className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56 mt-2 text-3xl "
					// onClick={postArticle }
					onClick={postAndClearInput}
					value="">
					新規投稿
				</button>
			</div>
			<br></br>
		</div>
	);
};
