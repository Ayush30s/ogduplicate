import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react"; // Using Lucide icon for a visual cue

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="text-red-600 w-10 h-10" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-red-600 mb-2">
          401 - Unauthorized
        </h1>
        <p className="text-gray-600 mb-6">
          You must be logged in to view this page. Please do login.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Go to Signin Page
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
