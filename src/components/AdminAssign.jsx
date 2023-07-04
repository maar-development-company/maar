import React, { useState, useEffect, useRef } from "react";

const URL =
	process.env.NODE_ENV === "production"
		? "https://maar-front.onrender.com"
		: "http://localhost:8080";

export const AdminAssign = () => {
	const user = sessionStorage.getItem("loginResultInfo");
	const [householdList, setHouseholdList] = useState([]);
	const [municipalityInfo, setMunicipalityInfo] = useState({});
	const [blockNameArr, setBlockNameArr] = useState([]);
	const [groupNumArr, setGroupNumArr] = useState([]);
	const [blockIndex, setBlockIndex] = useState("");
	const [groupIndex, setGroupIndex] = useState("");
	const [flag, setFlag] = useState(true);
	const [isClicked, setIsClicked] = useState(false);
	const [count, setCount] = useState(0);

	const cssTableHead =
		"p-2 border-collapse border-solid border-2 border-gray-300";
	const cssInsideTable =
		"p-2 border-collapse border-solid border-2 border-gray-300";

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
			console.log(resArray);
			const householdArray = resArray[0];
			console.log(householdArray);
			const municipalityObj = resArray[1][0];
			console.log(municipalityObj);

			setHouseholdList(householdArray);
			setBlockNameArr(JSON.parse(municipalityObj.blockNameArray));
			setGroupNumArr(JSON.parse(municipalityObj.groupNumArray));
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		getHouseholdList();
	}, []);

	const renderingAdmin = () => {
		const user = sessionStorage.getItem("loginResultInfo");
		const myID = JSON.parse(user).houseHoldNameID;
		console.log("myID : ", myID);
		return householdList.map((el, index) => {
			if (el.roleFlag === "1") {
				return (
					<tr className="border-collapse border-solid border-2 border-gray-300">
						<td className={cssInsideTable}>{el.block1}</td>
						<td className={cssInsideTable}>{el.block2}</td>
						<td className={cssInsideTable}>{el.householdName}</td>
						<td className={cssInsideTable}>
							{el.id !== myID && (
								<button
									className="bg-blue-100 hover:bg-blue-300 p-1 text-black rounded"
									onClick={() => {
										dismissal(index);
									}}>
									解任
								</button>
							)}
						</td>
					</tr>
				);
			}
		});
	};

	const renderingMember = (blockNameInd, groupNumInd) => {
		return householdList.map((el, index) => {
			if (blockNameInd === undefined && groupNumInd === undefined) {
				console.log("ブロックと組の指定はありません");
				if (el.roleFlag === "0") {
					return (
						<tr className="border-collapse border-solid border-2 border-gray-300 bg-color-white">
							<td className={cssInsideTable}>{el.block1}</td>
							<td className={cssInsideTable}>{el.block2}</td>
							<td className={cssInsideTable}>{el.householdName}</td>
							<td className={cssInsideTable}>
								<button
									className="bg-blue-800 hover:bg-blue-700 p-1 text-white rounded"
									onClick={() => {
										assign(index);
									}}>
									任命
								</button>
							</td>
						</tr>
					);
				}
			} else if (blockNameInd !== undefined && groupNumInd === "") {
				console.log("ブロックだけが指定されました");
				console.log("ブロック", blockNameArr[Number(blockNameInd)]);
				if (
					el.roleFlag === "0" &&
					el.block1 === blockNameArr[Number(blockNameInd)]
				) {
					console.log("ブロックと組の一致がありました");
					return (
						<tr className="border-collapse border-solid border-2 border-gray-300 bg-color-white">
							<td className={cssInsideTable}>{el.block1}</td>
							<td className={cssInsideTable}>{el.block2}</td>
							<td className={cssInsideTable}>{el.householdName}</td>
							<td className={cssInsideTable}>
								<button
									className="bg-blue-800 hover:bg-blue-700 p-1 text-white rounded"
									onClick={() => {
										assign(index);
									}}>
									任命
								</button>
							</td>
						</tr>
					);
				}
			} else if (blockNameInd !== undefined && groupNumInd !== undefined) {
				console.log("ブロックと組が指定されました");
				console.log("ブロック", blockNameArr[Number(blockNameInd)]);
				console.log(
					"組",
					groupNumArr[Number(blockNameInd)][Number(groupNumInd)]
				);
				if (
					el.roleFlag === "0" &&
					el.block1 === blockNameArr[Number(blockNameInd)] &&
					Number(el.block2) ===
						groupNumArr[Number(blockNameInd)][Number(groupNumInd)]
				) {
					console.log("ブロックと組の一致がありました");
					return (
						<tr className="border-collapse border-solid border-2 border-gray-300 bg-white">
							<td className={cssInsideTable}>{el.block1}</td>
							<td className={cssInsideTable}>{el.block2}</td>
							<td className={cssInsideTable}>{el.householdName}</td>
							<td className={cssInsideTable}>
								<button
									className="bg-blue-800 hover:bg-blue-700 p-1 text-white rounded"
									onClick={() => {
										assign(index);
									}}>
									任命
								</button>
							</td>
						</tr>
					);
				}
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

	const handleBlockNameChange = (e) => {
		const selectedBlockIndex = e.target.value;
		setBlockIndex(selectedBlockIndex);
	};

	const handleGroupNumChange = (e) => {
		const selectedGroupIndex = e.target.value;
		setGroupIndex(selectedGroupIndex);
	};

	const memberFilter = () => {
		// renderingMember(blockIndex, groupIndex);
		setIsClicked(true);
		setCount(count + 1);
	};
	useEffect(() => {
		renderingMember(blockIndex, groupIndex);
	}, [count]);

	const memberUnfilter = () => {
		setIsClicked(false);
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
		<div className="overflow-y-auto fixed top-24 bottom-12 right-0 left-0">
			<div className="mx-auto text-center flex flex-col justify-center md:w-3/4">
				<p className="text-3xl">
					管理者の任命・解任を設定し登録ボタンを押して下さい。
				</p>
				<button
					className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-40 mx-auto text-3xl"
					onClick={adminRegistration}>
					登録
				</button>
			</div>
			<div className="mx-auto mt-8 p-4 text-center flex flex-col justify-center md:w-3/4 rounded-3xl border border-blue-800 shadow-lg">
				<h1 className="text-3xl">管理者リスト</h1>
				<table className="shadow-lg text-center md:w-full justify-center border-collapse border-solid border-4 border-gray-300">
					<thead>
						<tr className="border-collapse border-double border-2 border-gray-300 bg-gray-100">
							<th className={cssTableHead}>丁目/ブロック</th>
							<th className={cssTableHead}>組</th>
							<th className={cssTableHead}>名前</th>
							<th className={cssTableHead}>解任</th>
						</tr>
					</thead>
					<tbody>{renderingAdmin()}</tbody>
				</table>
			</div>

			<div className="mx-auto mt-8 p-4 text-center flex flex-col justify-center md:w-3/4 rounded-3xl border border-gray-300 bg-gray-100 shadow-lg">
				<h1 className="text-3xl">加入者リスト検索</h1>
				<div className="mx-auto flex flex-row md:w-3/4">
					<select
						value={blockIndex}
						onChange={handleBlockNameChange}
						className="mx-auto border-2 mr-2">
						<option value="" disabled>
							丁目やブロックを選択してください
						</option>
						{blockNameArr.map((block, index) => {
							return <option value={index}>{block}</option>;
						})}
					</select>
					<br></br>
					<select
						value={groupIndex}
						onChange={handleGroupNumChange}
						className="mx-auto border-2">
						<option value="" disabled>
							組を選択してください
						</option>
						{blockIndex !== "" &&
							groupNumArr[Number(blockIndex)].map((group, index) => {
								return <option value={index}>{group}</option>;
							})}
					</select>
				</div>

				<div className="mx-auto my-1 flex flex-row justify-center md:w-3/4 bg-gray-100">
					<button
						className="bg-blue-800 hover:bg-blue-700 text-white rounded p-1 mr-2"
						onClick={memberFilter}>
						絞込
					</button>
					<button
						className="bg-blue-800 hover:bg-blue-700 text-white rounded p-1 ml-2"
						onClick={memberUnfilter}>
						解除
					</button>
				</div>
				<table className="shadow-lg text-center md:w-full justify-center border-collapse border-solid border-4 border-gray-300">
					<thead>
						<tr className="border-collapse border-double border-2 border-gray-300 bg-gray-100">
							<th className={cssTableHead}>丁目/ブロック</th>
							<th className={cssTableHead}>組</th>
							<th className={cssTableHead}>名前</th>
							<th className={cssTableHead}>任命</th>
						</tr>
					</thead>
					{isClicked || <tbody>{renderingMember()}</tbody>}
					{isClicked && (
						<tbody>{renderingMember(blockIndex, groupIndex)}</tbody>
					)}
				</table>
			</div>
			<br></br>
		</div>
	);
};
// groupNumArr[Number(blockNameInd)][Number(groupNumInd)];

// condition setCondition 0

// renderingMember
//  if condition === 0

//  if condition === 1
//   blockName groupNum if

//   絞り込み　setConstition(1) setFlag

//   解除　setCondition(0) setFlag
