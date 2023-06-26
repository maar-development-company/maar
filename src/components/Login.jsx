import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Select, Option } from "@material-tailwind/react";
import React, { useState, useEffect, useRef } from "react";
import bcrypt from "bcryptjs";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://maar-front.onrender.com"
    : "http://localhost:8080";

export const Login = (props) => {
  const {
    loginCom,
    setLoginCom,
    municipality,
    setMunicipality,
    municipalityId,
    setMunicipalityId,
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
  } = props;
  console.log(process.env);
  const [municipalitiesList, setMunicipalitiesList] = useState([]);
  const [municipalities, setMunicipalities] = useState("");

  useEffect(() => {
    console.log("useEffectの中");
    console.log(URL);
    getMunicipalitiesFunc();
  }, []);

  const writeToSessionStorage = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };
  const readFromSessionStorage = (key) => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  const getMunicipalitiesFunc = async () => {
    try {
      const response = await fetch(`${URL}/muni`);
      if (!response.ok) {
        throw new Error("Failed to fetch.");
      }
      const municipalitiesObj = await response.json();
      console.log(municipalitiesObj);
      if (municipalitiesObj.length !== municipalitiesList.length) {
        setMunicipalitiesList(municipalitiesObj);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //0:NG 1:user 2:admin
  // const testA = { judge: 0, name: "森" };
  // const testB = { judge: 1, name: "福島" };
  // const testC = { judge: 2, name: "久場" };

  const handleCategoryTownChange = (e) => {
    //木田さんも解決してくれたのでとりあえずコメントアウト
    //     const selectValue = JSON.parse(e.target.value);
    //     console.log(selectValue.id);
    //     console.log(selectValue.name);
    //     setMunicipalityId(selectValue.id);
    //     setMunicipality(selectValue.name);
    //     console.log(municipality);
    //     console.log(municipalityId);

    const selectedId = parseInt(e.target.value);
    const selectedTown = municipalitiesList.find(
      (town) => town.id === selectedId
    );
    setMunicipalityId(selectedTown.id);
    setMunicipality(selectedTown.municipalitiesName);
    setMunicipalities(selectedTown.municipalitiesName);
  };

  const handleEmailAddressChange = (e) => {
    console.log(e.target.value);
    setEmailAddress(e.target.value);
    console.log(emailAddress);
  };

  const handlePasswordChange = (e) => {
    console.log(e.target.value);
    setPassword(e.target.value);
    console.log(password);
  };

  const login = async () => {
    //バリデーション
    if (emailAddress === null || password === null || municipality === null) {
      return window.alert("未入力の項目があります");
    }
    //データベースにPOSTする処理
    console.log("loginボタンが押された");
    try {
      const data = {
        loginCategory: 0,
        mailadress: emailAddress,
        password: password,
        municipalities: municipalities,
      };
      console.log("dataの中身　　", data);
      const res = await fetch(`${URL}/maar/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result);

      writeToSessionStorage("loginInfo", data);
      writeToSessionStorage("loginResultInfo", result);

      if (result.judge === 0) {
        window.alert("町内会名又はEmailAddress又はpasswordが間違っています");
      } else if (result.judge === 1) {
        setLoginCom(1);
        window.alert(`ようこそ${result.name}さん`);
      } else if (result.judge === 2) {
        setLoginCom(2);
        window.alert(`ようこそ管理者の${result.name}さん`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const newLogin = async () => {
    //バリデーション
    if (emailAddress === null || password === null || municipality === null) {
      return window.alert("未入力の項目があります");
    }
    //データベースにPOSTする処理
    console.log("新規登録ボタンが押された");
    try {
      const data = await hashFunc();
      console.log("dataの中身　　", data);
      const res = await fetch(`${URL}/maar/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result);

      writeToSessionStorage("loginInfo", data);
      writeToSessionStorage("loginResultInfo", result);

      window.alert(
        `メールアドレス:${emailAddress}\nパスワード:${password}\n地域名:${municipalities}\nで登録しました。`
      );
    } catch (error) {
      window.alert(`登録に失敗しました。最初からやり直してください。`);
      console.error(error);
    }
  };

  const hashFunc = async () => {
    const plainPassword = password;
    const saltRounds = 10;

    try {
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      console.log("元のパスワード:", password);
      console.log("ハッシュ化されたパスワード:", hashedPassword);
      return {
        loginCategory: 1,
        mailadress: emailAddress,
        password: hashedPassword,
        municipalities: municipalities,
      };
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <header className="p-2 bg-gradient-to-b from-blue-500 to-blue-200 sticky top-0 z-50">
        <p className="text-4xl text-center">まある</p>
        <h1>ログイン画面 SatoTaro ah29f9d8 aaaa@mail</h1>
        <p className="text-4xl text-center">ログイン画面</p>
      </header>
      <select
        className="w-11/12 h-20 bg-gray-100 bg-opacity-50 rounded border
        mt-4 ml-2 mr-2 text-3xl"
        variant="standard"
        label="町内会名を選択してください"
        onChange={handleCategoryTownChange}
        defaultValue=""
      >
        <option value="" disabled>
          町内会名を選択
        </option>
        {municipalitiesList.map((item) => (
          <option key={item.id} value={item.id}>
            {item.municipalitiesName}
          </option>
        ))}
      </select>
      <input
        className="w-11/12 h-20 bg-gray-100 bg-opacity-50 rounded border
        mt-4 ml-2 mr-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 outline-none text-gray-700 text-4xl
           py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        type="text"
        placeholder="メールアドレス"
        value={emailAddress}
        onChange={handleEmailAddressChange}
      />
      <input
        className="w-11/12 h-20 bg-gray-100 bg-opacity-50 rounded border
        mt-4 ml-2 mr-2
         border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2
          focus:ring-indigo-200 outline-none text-gray-700 text-4xl
           py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={handlePasswordChange}
      />
      <div className="flex flex-row items-center justify-center">
        <button
          onClick={login}
          className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-40 mt-2 mr-2 text-3xl flex flex-row"
        >
          ログイン
        </button>
        <button
          onClick={newLogin}
          className="bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2 w-40 mt-2 text-3xl flex flex-row"
        >
          新規登録
        </button>
      </div>
      <b></b>
    </div>
  );
};
