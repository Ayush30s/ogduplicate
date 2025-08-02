import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserTypeAccessGuard = ({ children }) => {
  const loggedInUser = useSelector((store) => store.login);
  const userType = loggedInUser?.user?.userType;
  const childComponentName = children?.type?.name;

  if (childComponentName === "WorkoutPlanForm" && userType === "gymModel") {
    return <Navigate to="/access-denied" />;
  }

  // BLOCK if mismatched component access
  if (
    (childComponentName === "GymDashboard" && userType !== "gymModel") ||
    (childComponentName === "UserDashboard" && userType !== "userModel")
  ) {
    return <Navigate to="/access-denied" />;
  }
  return children;
};

export default UserTypeAccessGuard;
