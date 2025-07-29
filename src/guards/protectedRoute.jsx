import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../common/loading";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(
          "https://gymbackenddddd-1.onrender.com/register/verify-token",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        console.log(err);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [isAuth]);

  if (loading) {
    return <Loading />;
  }

  return isAuth ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
