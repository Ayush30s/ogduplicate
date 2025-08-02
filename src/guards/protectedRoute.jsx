import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isAuth ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
