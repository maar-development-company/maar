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
    if (blockNum > 100) {
      window.alert("数値が大きすぎます。100以内の数を入力してください。");
      return;
    }
    const arr = [];
    for (let i = 0; i < blockNum; i++) {
      arr.push(i);
    }
    setDummyArr(arr);
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
    <div className="overflow-y-auto fixed top-24 bottom-14 right-0 left-0">
      <div className="shadow-lg m-2 p-4 border rounded-lg mx-auto text-center flex flex-col justify-center bg-gray-50 md:w-3/4 w-11/12">
        <p className="m-2 text-3xl">
          組織を設定した後登録ボタンを押してください。
        </p>
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-40 mx-auto text-3xl"
          onClick={organizationSet}
        >
          登録
        </button>
      </div>
      <div className="shadow-lg m-2 p-4 border rounded-lg mx-auto text-center flex flex-col items-center justify-center bg-gray-50 md:w-3/4 w-11/12">
        <p className="m-2 ml-2 mr-2 text-3xl">
          組織の大分類となる数を入力し入力欄の作成ボタンを押してください。
        </p>
        {/* <div className="flex flex-row items-center"> */}
        <input
          className="w-20 h-10 m-2 p-2 bg-gray-50 rounded-lg border text-gray-700 text-3xl text-center"
          type="text"
          placeholder="数値"
          value={blockNum}
          onChange={handleBlockNumChange}
          required
        />
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-64 mx-auto text-3xl"
          onClick={onClickInputCreateButton}
        >
          入力欄の作成
        </button>
        {/* </div> */}
      </div>
      <div className="shadow-lg m-2 p-4 border rounded-lg mx-auto text-center flex flex-col items-center justify-center bg-gray-50 md:w-3/4 w-11/12">
        {dummyArr.map((ele, index) => {
          return (
            <div className="flex item-center">
              <input
                className="rouded border rounded-lg mt-4 p-1 text-3xl text-center w-96"
                placeholder="丁目やブロック名を入力"
                value={blockNameArr[index] || ""}
                onChange={(e) => handleBlockNameChange(index, e)}
              />
              <p className="mt-4 p-1 text-3xl">の中には</p>
              <input
                className="rouded border rounded-lg mt-4 p-1 text-3xl text-center w-20 "
                placeholder="数値"
                value={groupNumArr[index] || ""}
                onChange={(e) => handleGroupNumChange(index, e)}
              />
              <p className="mt-4 p-1 text-3xl">組ある</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
