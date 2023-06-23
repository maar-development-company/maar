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

export const AdminMenu = (props) => {
  const { municipality, municipalityId } = props;
  const menuStyle =
    "m-4 p-4 h-44 md:h-28 border-solid rounded-3xl border-4 border-gray-300 text-center md:flex md:flex-row";
  return (
    <div>
      <div>
        <Link
          to="/NewPost"
          state={{ municipality: municipality, id: municipalityId }}
        >
          <div className={menuStyle}>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="flex items-center justify-center text-6xl md:justify-start">
                <BsPen />
              </div>
              <p className="items-center justify-center text-6xl ">
                お知らせ新規投稿
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Link
          to="https://www.city.nagoya.jp/sportsshimin/page/0000149515.html"
          state={{ test: "test" }}
        >
          <div className={menuStyle}>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="flex items-center justify-center text-6xl md:justify-start">
                <GrGroup />
              </div>
              <p className="items-center justify-center text-6xl ">
                管理者メンバー設定（工事中）
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Link
          to="https://www.city.nagoya.jp/sportsshimin/page/0000149515.html"
          state={{ test: "test" }}
        >
          <div className={menuStyle}>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="flex items-center justify-center text-6xl md:justify-start">
                <MdHearing />
              </div>
              <p className="items-center justify-center text-6xl ">
                アンケート作（工事中）
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Link
          to="https://www.city.nagoya.jp/sportsshimin/page/0000149515.html"
          state={{ test: "test" }}
        >
          <div className={menuStyle}>
            <div className="flex flex-col items-center justify-center md:flex-row">
              <div className="flex items-center justify-center text-6xl md:justify-start">
                <RiOrganizationChart />
              </div>
              <p className="items-center justify-center text-6xl ">
                自治区組織設定（工事中）
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
