import React, { useState, useEffect, useRef } from "react";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://maar-front.onrender.com"
    : "http://localhost:8080";

export const AdminAssign = () => {
  const user = sessionStorage.getItem("loginResultInfo");
  const [householdList, setHouseholdList] = useState([]);
  const [municipalityInfo, setMunicipalityInfo] = useState({});

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
      const municipalityObj = resArray[1][0];
      console.log(municipalityObj);
      const stringData = municipalityObj.blockNameArray;
      console.log(stringData);
      const parsedArray = JSON.parse(stringData);
      console.log(":", householdArray);
      console.log(parsedArray);
      setHouseholdList(householdArray);
      setMunicipalityInfo(municipalityObj);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getHouseholdList();
  }, []);
  console.log(householdList);

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
          <tbody>
            {householdList
              .filter((el) => {
                // console.log(el);
                return el.roleFlag === "1";
              })
              .map((el) => {
                // console.log(el);
                return (
                  <tr>
                    <td>{el.block1}</td>
                    <td>{el.block2}</td>
                    <td>{el.householdName}</td>
                    <td>
                      <button>解任する</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
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
          <tbody>
            {householdList
              .filter((el) => {
                // console.log(el);
                return el.roleFlag === "0";
              })
              .map((el) => {
                // console.log(el);
                return (
                  <tr>
                    <td>{el.block1}</td>
                    <td>{el.block2}</td>
                    <td>{el.householdName}</td>
                    <td>
                      <button>任命する</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};
