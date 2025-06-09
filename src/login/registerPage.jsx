import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
        Welcome to FitConnect
      </h1>
      <p className="text-lg text-gray-400 text-center max-w-2xl mb-10">
        Your all-in-one platform for connecting fitness enthusiasts with the
        best gyms. Whether you're looking to join a fitness community or open
        your own gym, FitConnect helps you every step of the way.
      </p>

      <div className="flex space-x-4 mb-12">
        <Link to="/register/user">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105">
            Join a Gym
          </button>
        </Link>
        <Link to="/register/owner">
          <button className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105">
            Open a Gym
          </button>
        </Link>
      </div>

      <div className="max-w-3xl text-center text-gray-400">
        <h3 className="text-xl font-semibold text-white mb-2">
          Why FitConnect?
        </h3>
        <ul className="space-y-2 text-sm">
          <li>✅ Easily find gyms near you or across the country</li>
          <li>
            ✅ Manage memberships, schedules, and workouts all in one place
          </li>
          <li>
            ✅ For gym owners: list, manage, and grow your fitness business
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RegisterPage;
