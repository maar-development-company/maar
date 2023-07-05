import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import MyPage from "./components/MyPage";

Amplify.configure({
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_AWS_USER_POOLS_CLIENT_ID,
});

const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1",
});

function App1() {
  return (
    <>
      <div>
        <header className="p-2 bg-gradient-to-b from-blue-500 to-blue-200 sticky top-0 z-50">
          <p className="text-4xl text-center">まある</p>
          <p className="text-4xl text-center">ログイン画面</p>
        </header>

        <Authenticator signUpAttributes={["email", "name", "phone_number"]}>
          {({ signOut, user }) => (
            <Authenticator.Provider>
              <MyPage />
            </Authenticator.Provider>
          )}
        </Authenticator>
      </div>
    </>
  );
}
export default App1;
