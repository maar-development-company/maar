import React, { useState, useEffect, useRef } from "react";

const URL =
	process.env.NODE_ENV === "production"
		? "https://maar-front.onrender.com"
		: "http://localhost:8080";

export const OrganizationSetting = () => {
	const [blockNum, setBlockNum] = useState("");
	const [dummyArr, setDummyArr] = useState([]);
	const [blockNameArr, setBlockNameArr] = useState([]);
	const [groupNumArr, setGroupNumArr] = useState([]);

	const handleBlockNumChange = (e) => {
		console.log(e.target.value);
		const value = e.target.value.replace(/\D/g, "");
		setBlockNum(value);
	};

	const onClickInputCreateButton = () => {
		const arr = [];
		for (let i = 0; i < blockNum; i++) {
			arr.push(i);
		}
		setDummyArr(arr);
		console.log(dummyArr);
	};

	const handleBlockNameChange = (index, e) => {
		const { value } = e.target;
		console.log(blockNameArr);
		setBlockNameArr((prevArr) => {
			const updatedArr = [...prevArr];
			updatedArr[index] = value;
			return updatedArr;
		});
	};

	const handleGroupNumChange = (index, e) => {
		const value = e.target.value.replace(/\D/g, "");
		console.log(groupNumArr);
		setGroupNumArr((prevArr) => {
			const updatedArr = [...prevArr];
			updatedArr[index] = value;
			return updatedArr;
		});
	};

	const organizationSet = async () => {
		console.log("組織情報登録ボタンが押された");
		//バリデーション
		if (
			blockNum === "" ||
			blockNameArr.length !== Number(blockNum) ||
			groupNumArr.length !== Number(blockNum)
		) {
			console.log("ボタン入力を阻止します");
			window.alert("入力情報に不足があります");
			return;
		}
		const user = sessionStorage.getItem("loginResultInfo");

		//データベースへPOSTする処理
		try {
			const data = {
				municipalitiesID: JSON.parse(user).municipalitiesID,
				blockNameArray: blockNameArr,
				groupNumArray: groupNumArr,
			};
			console.log("dataの中身　　", data);
			const res = await fetch(`${URL}/muni`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const result = await res.text();
			console.log(result);
			if (result === "組織情報登録完了") {
				setBlockNameArr([]);
				setGroupNumArr([]);
				window.alert("自治区組織の登録が終わりました");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="overflow-y-auto fixed top-36 bottom-12 right-0 left-0">
			<div className="ml-10">
				<h1 className="sm:text-3xl text-4xl title-font font-medium text-gray-900 mt-4 mb-4">
					町内会の組織を設定してください。
				</h1>
				<div className="flex item-center">
					<input
						className="w-20 h-full bg-gray-100 bg-opacity-50 rounded border
        mt-4 ml-2 mr-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 outline-none text-gray-700 text-3xl
           py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
						type="text"
						placeholder="丁目やブロック等の大分類組織数を入力"
						value={blockNum}
						onChange={handleBlockNumChange}
						required
					/>
					<p className="mt-4 ml-2 mr-2 text-3xl">
						:組織内の大分類となる数（丁目やブロック）を入力
					</p>
				</div>
				<button
					className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-64 mx-auto text-3xl mb-8"
					onClick={onClickInputCreateButton}>
					入力欄を作成
				</button>
			</div>
			<div className="ml-10">
				{dummyArr.map((ele, index) => {
					return (
						<div className="flex item-center">
							<input
								className="rouded border mt-4 p-1 text-3xl w-96"
								placeholder="丁目やブロック名を入力"
								value={blockNameArr[index] || ""}
								onChange={(e) => handleBlockNameChange(index, e)}
							/>
							<p className="mt-4 p-1 text-3xl">の中には</p>
							<input
								key={ele + 100}
								className="rouded border mt-4 p-1 text-3xl w-12 "
								placeholder="組の数"
								value={groupNumArr[index] || ""}
								onChange={(e) => handleGroupNumChange(index, e)}
							/>
							<p className="mt-4 p-1 text-3xl">組ある</p>
						</div>
					);
				})}
				<button
					className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-64 mx-auto text-3xl"
					onClick={organizationSet}>
					組織情報を登録
				</button>
			</div>
		</div>
	);
};
