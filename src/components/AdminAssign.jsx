import React, { useState, useEffect, useRef } from "react";

const URL =
	process.env.NODE_ENV === "production"
		? "https://maar-front.onrender.com"
		: "http://localhost:8080";

export const AdminAssign = () => {
	const user = sessionStorage.getItem("loginResultInfo");
	const [householdList, setHouseholdList] = useState([]);
	const [municipalityInfo, setMunicipalityInfo] = useState({});
	const [flag, setFlag] = useState(true);

	const getHouseholdList = async () => {
		//データベースにGETする処理
		const municipalitiesID = JSON.parse(user).municipalitiesID;

		try {
			const response = await fetch(
				`${URL}/maar/householdList?municipalitiesID=${municipalitiesID}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch.");
			}
			const resArray = await response.json();
			const householdArray = resArray[0];
			// const municipalityObj = resArray[1][0];
			// console.log(municipalityObj);
			// const stringData = municipalityObj.blockNameArray;
			// console.log(stringData);
			// const parsedArray = JSON.parse(stringData);
			console.log(":", householdArray);
			// console.log(parsedArray);
			setHouseholdList(householdArray);
			// setMunicipalityInfo(municipalityObj);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		getHouseholdList();
	}, []);
	console.log(householdList);

	const renderingAdmin = () => {
		const user = sessionStorage.getItem("loginResultInfo");
		const myID = JSON.parse(user).houseHoldNameID;
		console.log("myID : ", myID);
		return householdList.map((el, index) => {
			if (el.roleFlag === "1") {
				return (
					<tr>
						<td>{el.block1}</td>
						<td>{el.block2}</td>
						<td>{el.householdName}</td>
						<td>
							{el.id !== myID && (
								<button
									onClick={() => {
										dismissal(index);
									}}>
									{index}さんを解任する
								</button>
							)}
						</td>
					</tr>
				);
			}
		});
	};
	const renderingMember = () => {
		return householdList.map((el, index) => {
			if (el.roleFlag === "0") {
				return (
					<tr>
						<td>{el.block1}</td>
						<td>{el.block2}</td>
						<td>{el.householdName}</td>
						<td>
							<button
								onClick={() => {
									assign(index);
								}}>
								{index}さんを任命する
							</button>
						</td>
					</tr>
				);
			}
		});
	};

	const dismissal = (index) => {
		const currentHouseholdList = householdList;
		currentHouseholdList[index].roleFlag = "0";
		console.log("解任後 : ", currentHouseholdList);
		setHouseholdList(currentHouseholdList);
		setFlag(!flag);
	};

	const assign = (index) => {
		const currentHouseholdList = householdList;
		currentHouseholdList[index].roleFlag = "1";
		console.log("任命後 : ", currentHouseholdList);
		setHouseholdList(currentHouseholdList);
		setFlag(!flag);
	};

	// 解任・任命ボタンを押したときに再度表を描写し直したい（実装途中）
	useEffect(() => {
		renderingAdmin();
		renderingMember();
	}, [flag]);

	const adminRegistration = async () => {
		try {
			const data = householdList;
			console.log("data : ", data);

			const res = await fetch(`${URL}/maar/admin_assign`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const result = await res.text();
			// console.log(result);
			if (result === "登録完了") {
				window.alert("登録完了しました。");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<div>
				<h1>現在の管理者リスト</h1>
				<table>
					<thead>
						<tr>
							<th>丁目やブロック</th>
							<th>組</th>
							<th>名前</th>
							<th>解任ボタン</th>
						</tr>
					</thead>
					<tbody>{renderingAdmin()}</tbody>
				</table>
			</div>

			<div className="mt-10">
				<h1>区民リスト検索</h1>
				<select>
					<option value="" disabled>
						丁目やブロックを選択してください
					</option>
					{/* {JSON.parse(municipalityInfo.blockNameArray).map((block, index) => {
            <option value={index}>{block}</option>;
          })} */}
				</select>
				<table>
					<thead>
						<tr>
							<th>丁目やブロック</th>
							<th>組</th>
							<th>名前</th>
							<th>任命ボタン</th>
						</tr>
					</thead>
					<tbody>{renderingMember()}</tbody>
				</table>
				<br></br>
				<p>以上の内容で登録します。よろしければボタンを押して下さい。</p>
				<button onClick={adminRegistration}>登録</button>
			</div>
		</>
	);
};
