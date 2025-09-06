import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GymCard from "./Gym/gymcard";
import { useSelector } from "react-redux";
import AllListing from "../listing/allListings";
import GymFilter from "./Gym/gymFilter";
import Loading from "../common/loading";

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
          `https://gymbackenddddd-1.onrender.com/home${location.search}`,
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
    <div className="min-h-screen bg-gray-950 text-white z-0">
      {/* Hero Section */}
      {loggedInuser.user.userType === "userModel" ? (
        <section className="z-0 bg-gradient-to-r from-indigo-900 to-purple-900 py-16 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Find Your Perfect Gym
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover premium fitness centers tailored to your goals with our
              curated selection of top-rated gyms.
            </p>
          </div>
        </section>
      ) : (
        <section className="z-0 bg-gradient-to-r from-indigo-900 to-purple-900 py-16 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Gym Owner Dashboard
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Manage your gym profile and connect with fitness enthusiasts
              looking for quality training facilities.
            </p>
            <Link
              to="/home/gym-dashboard"
              className="inline-block px-8 py-3 bg-white text-indigo-900 font-semibold rounded-lg shadow hover:bg-gray-100 transition duration-300"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      )}

      {/* Main Content */}
      {loggedInuser.user.userType === "userModel" ? (
        <main className="container mx-auto px-6 py-12 -mt-16 relative z-10">
          {/* Filter Section */}
          <div className="bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg mb-10 border border-gray-800">
            <GymFilter
              handleReset={handleReset}
              handleSubmit={handleSubmit}
              formData={formData}
              handleFilterChange={handleFilterChange}
            />
          </div>

          {/* Results Section */}
          <div className="z-0">
            <h2 className="text-3xl font-bold mb-8 text-gray-100 border-b border-gray-800 pb-3">
              Available Gyms
            </h2>

            {loading ? (
              <Loading />
            ) : gyms.length > 0 ? (
              <div className="z-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {gyms.map((gym, index) => (
                  <Link
                    to={`/home/gym/${gym.gymId}`}
                    key={index}
                    className="transition duration-300 transform hover:scale-[1.02]"
                  >
                    <GymCard data={gym} darkMode={true} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/70 rounded-xl shadow-lg p-10 text-center border border-gray-800">
                <p className="text-gray-400 text-lg mb-4">
                  No gyms found matching your criteria.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-500 transition"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Equipments for <span className="text-indigo-400">Rent</span> and{" "}
              <span className="text-indigo-400">Sale</span>
            </h1>
            <p className="mt-2 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Browse through a wide range of equipment available for renting or
              purchasing, all at the best prices.
            </p>
          </div>

          <AllListing />
        </main>
      )}
    </div>
  );
};

export default Home;
