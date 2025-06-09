import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const UserTypeAccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Lock className="text-yellow-600 w-10 h-10" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-yellow-600 mb-2">
          Access Restricted
        </h1>
        <p className="text-gray-600 mb-6">
          As a gym account, you are not permitted to view or join other gyms'
          pages.
        </p>
        <Link
          to="/home"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UserTypeAccess;
