import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { singleArticle } from "./SingleArticle";
import { NewPost } from "./NewPost";
import { BsPen } from "react-icons/bs";
import { GrGroup } from "react-icons/gr";
import { MdHearing } from "react-icons/md";
import { RiOrganizationChart } from "react-icons/ri";
import dayjs from "dayjs";

export const AdminMenu = (props) => {
  const { municipality, municipalityId, userName } = props;
  const menuStyle =
    "m-4 p-4 h-44 flex items-center justify-center md:h-28 border-solid rounded-3xl border bg-gray-100 hover:bg-gray-200 border-gray-300 shadow-lg md:flex md:flex-row md:justify-start";
  return (
    <div className="link-container overflow-y-auto fixed top-24 bottom-12 right-0 left-0">
      <div>
        <Link
          to="/NewPost"
          state={{
            municipality: municipality,
            id: municipalityId,
            userName: userName,
          }}
        >
          <div className={menuStyle}>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="flex items-center justify-center text-6xl md:justify-start">
                <BsPen />
              </div>
              <p className="ml-5 mr-5 items-center justify-center text-3xl ">
                お知らせ新規投稿
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Link
          to="/NewSurveyPost"
          state={{
            municipality: municipality,
            id: municipalityId,
            userName: userName,
          }}
        >
          <div className={menuStyle}>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="flex items-center justify-center text-6xl md:justify-start">
                <MdHearing />
              </div>
              <p className="ml-5 mr-5 items-center justify-center text-3xl ">
                アンケート作成投稿
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Link to="/AdminAssign" state={{ test: "test" }}>
          <div className={menuStyle}>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="flex items-center justify-center text-6xl md:justify-start">
                <GrGroup />
              </div>
              <p className="ml-5 mr-5 items-center justify-center text-3xl ">
                管理者メンバー設定
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Link to="/OrganizationSetting" state={{ test: "test" }}>
          <div className={menuStyle}>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="flex items-center justify-center text-6xl md:justify-start">
                <RiOrganizationChart />
              </div>
              <p className="ml-5 mr-5 items-center justify-center text-3xl ">
                自治区組織設定
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
