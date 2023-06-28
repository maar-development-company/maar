import { Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { singleArticle } from "./SingleArticle";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

dayjs.locale(ja);

const now = dayjs().format("YYYY年MM月DD日");
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

const URL =
	process.env.NODE_ENV === "production"
		? "https://maar-front.onrender.com"
		: "http://localhost:8080";

export const ArticleList = (props) => {
	const { municipalityId, municipality } = props;
	const [ArticleList, setArticleList] = useState([]);
	const [elementsArr, setElementsArr] = useState([]);
	const [ID, setID] = useState(2);
	const [number, setNumber] = useState("");

	useEffect(() => {
		getArticleList();
	}, [number]);

	const writeToSessionStorage = (key, value) => {
		sessionStorage.setItem(key, JSON.stringify(value));
	};
	const readFromSessionStorage = (key) => {
		const value = sessionStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	};

	const getArticleList = async () => {
		//データベースにGETする処理
		const encodedMunicipality = encodeURIComponent(municipality);
		const encodedhouseholdNameID =
			readFromSessionStorage("loginResultInfo").houseHoldNameID;

		// console.log(
		//   "ちぇっくしたいやつ",
		//   readFromSessionStorage("loginResultInfo").houseHoldNameID
		// );
		try {
			const response = await fetch(
				`${URL}/maar/articlelist?municipalitiesName=${encodedMunicipality}&householdNameID=${encodedhouseholdNameID}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch.");
			}
			const articleObj = await response.json();
			setNumber(articleObj.length);
			console.log(articleObj);
			if (articleObj.length !== ArticleList.length) {
				setArticleList(articleObj);
			}
		} catch (error) {
			console.error(error);
		}
	};
	getArticleList();

	return (
		<div>
			<div>
				<button
					onClick={getArticleList}
					className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-fit fixed top-0 right-0">
					一覧更新
				</button>
			</div>
			{ArticleList.reverse().map((ele) => {
				console.log("");
				let contentBeginning;
				const textContent = ele.articleContent;
				if (textContent.length > 20) {
					// 表示したい字数を決めたら変更する（現在：「20」）
					contentBeginning = `${textContent.substr(0, 20)}...`; // 表示したい字数を決めたら変更する（現在：「20」）
				} else {
					contentBeginning = textContent;
				}
				return (
					<Link to="/SingleArticle" state={{ articleInfo: ele }}>
						<section className="m-4 p-4 border-solid rounded-3xl border-4 border-gray-300 text-center h-fit">
							<div
								className={
									ele.readFlag === 0
										? "p-1 bg-blue-800 text-gray-100 h-12 rounded-3xl text-3xl text-center w-40 float-right"
										: "border border-solid border-black h-12 rounded-3xl text-3xl text-center w-40 float-right"
								}>
								{ele.readFlag === 0 ? "よんでね" : "よんだ"}
							</div>
							<br></br>
							<div className="w-full text-left">
								<h2 className="text-3xl">{ele.articleTitle}</h2>
								<p className="text-2xl mt-4 text-gray-700">
									{contentBeginning}
								</p>
								<p className="mt-4">{ele.articleTimestamp}</p>
							</div>
						</section>
					</Link>
				);
			})}
		</div>
	);
};
