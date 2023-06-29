import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { GrCatalog } from "react-icons/gr";
import { BsGear } from "react-icons/bs";
import { BiDownArrowAlt } from "react-icons/bi";
import { SlBubble } from "react-icons/sl";
import { AiOutlineHome } from "react-icons/ai";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { Login } from "./components/Login";
import { ArticleList } from "./components/Articlelist";
import { SingleArticle } from "./components/SingleArticle";
import { AdminMenu } from "./components/AdminMenu";
import { NewPost } from "./components/NewPost";
import { OrganizationSetting } from "./components/OrganizationSetting";
import { PageBackButton } from "./components/PageBackButton";
import dayjs from "dayjs";
import { Registration } from "./components/Registration";
import { NewContract } from "./components/NewContract";
import { PiTaxiLight } from "react-icons/pi";
import { FileUploader } from "./components/FileUploader";
import { DisplayImage } from "./components/DisplayImage";
import { TakePicture } from "./components/TakePicture";

const AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
	secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
	region: "us-east-1",
});

function App() {

  // console.log(process.env.REACT_APP_AWS_ACCESS_KEY);
  // console.log(process.env.REACT_APP_AWS_SECRET_KEY);
  //S3ファイル一覧取得ー始ーーーーーーーーーーーーーーー
  const s3 = new AWS.S3();
  const bucketName = "article-area";

  async function listObjects(bucketName) {
    try {
      const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
      console.log("バケット内のオブジェクト一覧:");
      response.Contents.forEach((obj) => {
        console.log(obj.Key);
      });
    } catch (error) {
      console.error("オブジェクト一覧の取得に失敗しました:", error);
    }
  }

  // バケット名を指定してオブジェクト一覧を取得します
  listObjects(bucketName);
  //S3ファイル一覧取得ー終ーーーーーーーーーーーーーーー


	// console.log(process.env);
	//loginCom = 0 ログインしてない　1:普通ユーザー　2:管理者
	const [loginCom, setLoginCom] = useState(0);
	const [userName, setUserName] = useState("");
	const [municipality, setMunicipality] = useState("");
	const [municipalityId, setMunicipalityId] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [history, setHistory] = useState("");
	console.log("loginCom : ", loginCom);


  // ログイン状態を確認する。
  useEffect(() => {
    const data = sessionStorage.getItem("loginInfo");
    const user = sessionStorage.getItem("loginResultInfo");
    // console.log(data);
    // console.log(user);
    user
      ? setMunicipality(JSON.parse(user).municipalitiesName)
      : setMunicipality("");
    user ? setLoginCom(JSON.parse(user).judge) : setLoginCom(0);
    user ? setUserName(JSON.parse(user).name) : setUserName("");
  }, []);

	const logout = () => {
		sessionStorage.removeItem("loginInfo");
		sessionStorage.removeItem("loginResultInfo");
		setLoginCom(0);
		location.href = "/";
	};

	const menuStyle =
		"m-4 p-4 h-44 flex items-center justify-center md:h-28 border-solid rounded-3xl border-4 border-gray-300 md:flex md:flex-row md:justify-start";
	return (
		<div>
			{loginCom === 0 && (
				<Router>
					<Routes>
						<>
							<Route
								path="/"
								element={
									<>
										<Login
											loginCom={loginCom}
											setLoginCom={setLoginCom}
											setUserName={setUserName}
											municipality={municipality}
											setMunicipality={setMunicipality}
											municipalityId={municipalityId}
											setMunicipalityId={setMunicipalityId}
											emailAddress={emailAddress}
											setEmailAddress={setEmailAddress}
											password={password}
											setPassword={setPassword}
										/>
										<TakePicture />
										<FileUploader />
										<DisplayImage />
									</>
								}
							/>
							<Route
								path="/registration"
								element={
									<Registration
										loginCom={loginCom}
										setLoginCom={setLoginCom}
										setUserName={setUserName}
										municipality={municipality}
										setMunicipality={setMunicipality}
										municipalityId={municipalityId}
										setMunicipalityId={setMunicipalityId}
										emailAddress={emailAddress}
										setEmailAddress={setEmailAddress}
										password={password}
										setPassword={setPassword}
									/>
								}
							/>
							<Route path="/newcontract" element={<NewContract />} />
						</>
					</Routes>
				</Router>
			)}
			{loginCom !== 0 && (
				<Router>
					<header className="h-36 p-2 bg-gradient-to-b from-blue-500 to-blue-200 sticky top-0 z-0">
						<p className="text-4xl text-center">まある</p>
						<p className="text-4xl text-left">{municipality}</p>
						<p className="text-4xl text-left">{userName}さん</p>
					</header>
					{/* <BiDownArrowAlt className="animate-pulse" /> */}
					<Routes>
						<Route
							path="/"
							element={
								<>
									<div className="link-container">
										<Link to="/articlelist">
											<div className={menuStyle}>
												<div className="flex flex-col items-center justify-center md:flex-row">
													<div className="flex items-center justify-center text-6xl md:justify-start">
														<GrCatalog />
													</div>
													<p className="ml-5 mr-5 items-center justify-center text-3xl ">
														回覧板
													</p>
												</div>
											</div>
										</Link>
										<Link to="/">
											<div className={menuStyle}>
												<div className="flex flex-col items-center justify-center md:flex-row">
													<div className="flex items-center justify-center text-6xl md:justify-start">
														<SlBubble />
													</div>
													<p className="ml-5 mr-5 items-center justify-center text-3xl ">
														アンケート回答
													</p>
												</div>
											</div>
										</Link>
										<a className={menuStyle} href="tel:000-1234-5678">
											<div className="flex flex-col items-center justify-center md:flex-row">
												<div className="flex items-center justify-center text-6xl md:justify-start">
													<PiTaxiLight />
												</div>
												<p className="ml-5 mr-5 items-center justify-center text-3xl ">
													タクシーを呼ぶ
												</p>
											</div>
										</a>
										{loginCom === 2 && (
											<Link to="/AdminMenu">
												<div className={menuStyle}>
													<div className="flex flex-col items-center justify-center md:flex-row">
														<div className="flex items-center justify-center text-6xl md:justify-start">
															<BsGear />
														</div>
														<p className="ml-5 mr-5 text-3xl">管理者メニュー</p>
													</div>
													{/* </span> */}
													{/* <p className="mt-2">{`${municipality}からのお知らせです`}</p> */}
												</div>
											</Link>
										)}
									</div>
								</>
							}
						/>
						<Route
							path="/articlelist"
							element={
								<div>
									<ArticleList
										municipalityId={municipalityId}
										municipality={municipality}
									/>
								</div>
							}
						/>
						<Route
							path="/SingleArticle"
							element={
								<div>
									<SingleArticle />
								</div>
							}
						/>
						{loginCom === 2 && (
							<Route
								path="/AdminMenu"
								element={
									<div>
										<AdminMenu
											municipality={municipality}
											municipalityId={municipalityId}
										/>
									</div>
								}
							/>
						)}
						{loginCom === 2 && (
							<Route
								path="/NewPost"
								element={
									<div>
										<NewPost
											municipalityId={municipalityId}
											municipality={municipality}
										/>
									</div>
								}
							/>
						)}
						{loginCom === 2 && (
							<Route
								path="/OrganizationSetting"
								element={
									<div>
										<OrganizationSetting />
									</div>
								}
							/>
						)}
					</Routes>
					{/* <footer className="fixed bottom-0 flex flex-row items-center justify-center">
            <button className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-30 mt-2 mr-3 text-xl flex flex-row">
              <span>戻る</span>
            </button>
            <button
              onClick={() => (location.href = "/")}
              className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-30 mt-2 mr-3 text-xl flex flex-row"
            >
              <div
                className="flex items-center justify-center md:justify-start"
                onClick={() => console.log(loginCom)}
              ></div>
              <span>ホーム</span>
            </button>
            <button
              className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-fit mt-2 text-xl flex flex-row"
              onClick={logout}
            >
              <span>ログアウト</span>
            </button>
          </footer> */}

					<footer className="w-full fixed bottom-0 flex flex-row items-center justify-center bg-gradient-to-b from-blue-200 to-blue-500 ">
						<PageBackButton />
						<button
							onClick={() => (location.href = "/")}
							className="bg-blue-800 hover:bg-blue-700 text-white border-2 border-white rounded px-4 py-2 w-30 mt-2 mr-3 text-xl flex flex-row">
							<div
								className="flex items-center justify-center md:justify-start"
								onClick={() => console.log(loginCom)}></div>
							<span>ホーム</span>
						</button>
						<button
							className="bg-blue-800 hover:bg-blue-700 text-white border-2 border-white rounded px-4 py-2 w-fit mt-2 text-xl flex flex-row"
							onClick={logout}>
							<span>ログアウト</span>
						</button>
					</footer>
				</Router>
			)}
		</div>
	);

	// 										{loginCom === 2 && (
	// 											<Link to="/AdminMenu">
	// 												<div className={menuStyle}>
	// 													<div className="flex flex-col items-center justify-center md:flex-row">
	// 														<div className="flex items-center justify-center text-6xl md:justify-start">
	// 															<BsGear />
	// 														</div>
	// 														<p className="ml-5 mr-5 text-3xl">管理者メニュー</p>
	// 													</div>
	// 													{/* </span> */}
	// 													{/* <p className="mt-2">{`${municipality}からのお知らせです`}</p> */}
	// 												</div>
	// 											</Link>
	// 										)}
	// 									</div>
	// 								</>
	// 							}
	// 						/>
	// 						<Route
	// 							path="/articlelist"
	// 							element={
	// 								<div>
	// 									<ArticleList
	// 										municipalityId={municipalityId}
	// 										municipality={municipality}
	// 									/>
	// 								</div>
	// 							}
	// 						/>
	// 						<Route
	// 							path="/SingleArticle"
	// 							element={
	// 								<div>
	// 									<SingleArticle />
	// 								</div>
	// 							}
	// 						/>
	// 						{loginCom === 2 && (
	// 							<Route
	// 								path="/AdminMenu"
	// 								element={
	// 									<div>
	// 										<AdminMenu
	// 											municipality={municipality}
	// 											municipalityId={municipalityId}
	// 										/>
	// 									</div>
	// 								}
	// 							/>
	// 						)}
	// 						{loginCom === 2 && (
	// 							<Route
	// 								path="/NewPost"
	// 								element={
	// 									<div>
	// 										<NewPost
	// 											municipalityId={municipalityId}
	// 											municipality={municipality}
	// 										/>
	// 									</div>
	// 								}
	// 							/>
	// 						)}
	// 					</Routes>
	// <footer className="fixed bottom-0 flex flex-row items-center justify-center">
	// 	<PageBackButton />
	// 	<button
	// 		onClick={() => (location.href = "/")}
	// 		className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-30 mt-2 mr-3 text-xl flex flex-row">
	// 		<div
	// 			className="flex items-center justify-center md:justify-start"
	// 			onClick={() => console.log(loginCom)}></div>
	// 		<span>ホーム</span>
	// 	</button>
	// 	<button
	// 		className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-fit mt-2 text-xl flex flex-row"
	// 		onClick={logout}>
	// 		<span>ログアウト</span>
	// 	</button>
	// </footer>
	// 				</Router>
	// 			)}
	// 		</div>
	// 	);
}

// "position: fixed; bottom: 0; width: 100%"

export default App;
