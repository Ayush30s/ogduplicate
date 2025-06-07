import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Welcome to the Gym
      </h2>

      <div className="flex space-x-4">
        <Link to={"/register/user"}>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105">
            Join Gym
          </button>
        </Link>

        <Link to={"/register/owner"}>
          <button className="bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105">
            Open Gym
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
