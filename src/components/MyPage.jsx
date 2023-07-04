import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const MyPage = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  const handleLinkClick = () => {
    navigate("/", { state: { loginCom: 1 } });
  };

  return (
    <main>
      <p>
        <Link to="/articlelist">TOPページ</Link>
      </p>
      <li>email:{user.attributes.email}</li>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
};

export default MyPage;
