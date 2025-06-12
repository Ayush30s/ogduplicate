import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthAccessGuard = ({ children }) => {
  const userType = useSelector((store) => store.login);
  console.log(children);

  if (userType.user.userType !== "userModel") {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

export default AuthAccessGuard;
