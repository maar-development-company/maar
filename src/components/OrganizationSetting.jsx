import React, { useState, useEffect, useRef } from "react";

export const OrganizationSetting = () => {
  const [brockNum, setBrockNum] = useState("");
  const [dummyArr, setDummyArr] = useState([]);
  const [brockNameArr, setBrockNameArr] = useState([]);
  const [groupNumArr, setGroupNumArr] = useState([]);

  const handleBrockNumChange = (e) => {
    console.log(e.target.value);
    setBrockNum(e.target.value);
  };

  const onClickInputCreateButton = () => {
    const arr = [];
    for (let i = 0; i < brockNum; i++) {
      arr.push(i);
    }
    setDummyArr(arr);
    console.log(dummyArr);
  };

  const handleBrockNameChange = (index, e) => {
    const { value } = e.target;
    console.log(brockNameArr);
    setBrockNameArr((prevArr) => {
      const updatedArr = [...prevArr];
      updatedArr[index] = value;
      return updatedArr;
    });
  };

  const handleGroupNumChange = (index, e) => {
    const { value } = e.target;
    console.log(groupNumArr);
    setGroupNumArr((prevArr) => {
      const updatedArr = [...prevArr];
      updatedArr[index] = value;
      return updatedArr;
    });
  };

  return (
    <>
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
            value={brockNum}
            onChange={handleBrockNumChange}
            required
          />
          <p className="mt-4 ml-2 mr-2 text-3xl">
            :組織内の大分類となる数（丁目やブロック）を入力
          </p>
        </div>
        <button
          className="rounded border m-4 p-3 text-3xl"
          onClick={onClickInputCreateButton}
        >
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
                value={brockNameArr[index] || ""}
                onChange={(e) => handleBrockNameChange(index, e)}
              />
              <p className="mt-4 p-1 text-3xl">の中には</p>
              <input
                key={ele + 100}
                className="rouded border mt-4 p-1 text-3xl w-12 "
                placeholder="組の数"
                value={groupNumArr[index] || 1}
                onChange={(e) => handleGroupNumChange(index, e)}
              />
              <p className="mt-4 p-1 text-3xl">組ある</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
