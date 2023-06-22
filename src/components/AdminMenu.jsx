import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { singleArticle } from "./SingleArticle";
import { NewPost } from "./NewPost";

export const AdminMenu = (props) => {
  const { municipality, municipalityId } = props;

  return (
    <div>
      <div>
        <Link
          to="/NewPost"
          state={{ municipality: municipality, id: municipalityId }}
        >
          お知らせ新規投稿
        </Link>
      </div>
      <div>
        <Link
          to="https://www.city.nagoya.jp/sportsshimin/page/0000149515.html"
          state={{ test: "test" }}
        >
          管理者メンバー設定（工事中）
        </Link>
      </div>
      <div>
        <Link
          to="https://www.city.nagoya.jp/sportsshimin/page/0000149515.html"
          state={{ test: "test" }}
        >
          アンケート作（工事中）
        </Link>
      </div>
      <div>
        <Link
          to="https://www.city.nagoya.jp/sportsshimin/page/0000149515.html"
          state={{ test: "test" }}
        >
          自治区組織設定（工事中）
        </Link>
      </div>
    </div>
  );
};
