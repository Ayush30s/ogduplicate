import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GymCard from "./Gym/gymcard";
import { useSelector } from "react-redux";
import AllListing from "../listing/allListings";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gyms, setGyms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const loggedInuser = useSelector((store) => store.login);

  const [formData, setFormData] = useState({
    city: "",
    state: "",
    rating: "",
    maxPrice: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== ""))
    );
    navigate(`/home?${params.toString()}`);
  };
  const handleReset = () => {
    setFormData({
      city: "",
      state: "",
      rating: "",
      maxPrice: "",
    });
    navigate("/home");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:7000/home${location.search}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 401) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Unauthorized");
        }

        const data = await response.json();
        setGyms(data?.gymNotJoined || []);
      } catch (error) {
        setError(error.message);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search, navigate]);

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      {loggedInuser.user.userType === "userModel" ? (
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Gym
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover premium fitness centers tailored to your goals with our
              curated selection of top-rated gyms.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Gym Owner Dashboard
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Manage your gym profile and connect with fitness enthusiasts
              looking for quality training facilities.
            </p>
            <Link
              to="/home/gym-dashboard"
              className="inline-block px-8 py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      {loggedInuser.user.userType === "userModel" ? (
        <div className="container mx-auto px-6 py-8 -mt-12">
          {/* Filter Section */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">
              Filter Gyms
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Min Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="maxPrice"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter max price"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Reset Filters
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">
              Available Gyms
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : gyms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {gyms.map((gym, index) => (
                  <Link
                    to={`/home/gym/${gym.gymId}`}
                    key={index}
                    className="hover:transform hover:scale-105 transition duration-300"
                  >
                    <GymCard data={gym} darkMode={true} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-400 text-lg mb-4">
                  No gyms found matching your criteria.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 text-indigo-500 hover:text-indigo-400 font-medium focus:outline-none"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <AllListing />
      )}
    </div>
  );
};

export default Home;
