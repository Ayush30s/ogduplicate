import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthAccessGuard = ({ children }) => {
  const loggedInUser = useSelector((store) => store.login);
  const userType = loggedInUser?.user?.userType;
  const childComponentName = children?.type?.name;

  if (childComponentName === "WorkoutPlanForm" && userType !== "userModel") {
    return <Navigate to="/access-denied" />;
  }

  // BLOCK if mismatched component access
  if (
    (childComponentName === "GymDashboard" && userType !== "gymModel") ||
    (childComponentName === "UserDashboard" && userType !== "userModel")
  ) {
    return <Navigate to="/access-denied" />;
  }

  // ALLOW if access is valid
  return children;
};

export default AuthAccessGuard;
