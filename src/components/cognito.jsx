import { Authenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";

export function cognito() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <p>
            <Link to="/blank">ブランクページへ</Link>
          </p>
        </main>
      )}
    </Authenticator>
  );
}
