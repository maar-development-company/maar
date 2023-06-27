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

// const testArticleList = [
//   {
//     articleTitleID: 1,
//     title: "ごみ収集の日",
//     content:
//       "今週の火曜日はごみ収集の日です。粗大ゴミは、出さないようにしてください。粗大ゴミは今月末の30日に収集がありますので忘れないようにお願いします。",
//     readFlag: 0,
//     readTimestamp: "2023/06/21 15:41",
//     articleTimestamp: now,
//   },
//   {
//     articleTitleID: 30,
//     title: "大林町自治区総会の日",
//     content:
//       "きたる2023年7月15日は大林町の総会になります。皆様のご意見を集約する日でありますのでご面倒ではございますが、ぜひ大林公民館までお願いいたします。これからの良い町大林をみんなで作っていきましょう。",
//     readFlag: 0,
//     readTimestamp: "2023/06/21 16:41",
//     articleTimestamp: now,
//   },
//   {
//     articleTitleID: 100,
//     title: "ゲートボールの大会を開催します！ぜひご参加ください！",
//     content:
//       "6/29日はゲートボール大会の日です。ゲストでゲートボール日本代表であり、シドニーオリンピックで金メダルをとりました、ボブさんが来てくれます。彼のゲートショットは砂煙が舞い上がるほど強烈なショットだと聞いておりますので、当日はサングラスや保護メガネの準備をお願いいたします。",
//     readFlag: 1,
//     readTimestamp: "2023/06/21 17:41",
//     articleTimestamp: now,
//   },
// ];

export const ArticleList = (props) => {
	const { municipalityId, municipality } = props;
	const [ArticleList, setArticleList] = useState([]);
	const [elementsArr, setElementsArr] = useState([]);
	const [ID, setID] = useState(2);

	useEffect(() => {
		getArticleList();
	}, [ArticleList]);

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
					className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56">
					更新
				</button>
			</div>
			{ArticleList.reverse().map((ele) => {
				console.log("");
				let contentBeginning;
				const textContent = ele.articleContent;
				if (textContent.length > 5) {
					// 表示したい字数を決めたら変更する（仮で「5」）
					contentBeginning = `${textContent.substr(0, 5)}...`; // 表示したい字数を決めたら変更する（仮で「5」）
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
								<p className="text-2xl mt-4">{contentBeginning}</p>
								<p className="mt-4">{ele.articleTimestamp}</p>
							</div>
						</section>
					</Link>
				);
			})}
		</div>

		//     <>
		//       <div>
		//         <button
		//           onClick={getArticleList}
		//           className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-56"
		//         >
		//           更新
		//         </button>
		//       </div>
		//       <div>
		//         {ArticleList.map((ele) => {
		//           console.log("");
		//           return (
		//             <Link to="/SingleArticle" state={{ articleInfo: ele }}>
		//               <section className="m-4 p-4 h-44  border-solid rounded-3xl border-4 border-gray-300 text-center flex flex-row">
		//                 <div className="w-10/12 text-left">
		//                   <h2 className="text-3xl">{ele.articleTitle}</h2>
		//                   <p className="mt-4">{ele.articleTimestamp}</p>
		//                 </div>
		//                 {/* <div className="">{ele.readFlag === 0 ? "未読" : "既読"}</div> */}
		//                 <div className="">{ele.readFlag === "1" ? "既読" : "未読"}</div>
		//               </section>
		//             </Link>
		//           );
		//         })}
		//       </div>
		//     </>
	);
};
