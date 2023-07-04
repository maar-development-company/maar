import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React from "react";
import MyPage from "./MyPage";
Amplify.configure({
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_AWS_USER_POOLS_CLIENT_ID,
});
export default function LoginPage() {
  return (
    <Authenticator signUpAttributes={["email", "name", "phone_number"]}>
      {({ signOut, user }) => (
        <Authenticator.Provider>
          <MyPage />
        </Authenticator.Provider>
      )}
    </Authenticator>
  );
}
