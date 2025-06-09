import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const FollowersList = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggedinUser = useSelector((store) => store.login);

  useEffect(() => {
    const FetchFollowersList = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:7000/request/user/followersList/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.message) {
          setError(data.message);
          setData([]);
          return;
        }

        setData(data.userFollowersData);
      } catch (err) {
        console.error("Error fetching followers list:", err);
        setError(err.message || "Failed to fetch followers list");
      } finally {
        setLoading(false);
      }
    };

    FetchFollowersList();
  }, [id]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 20 }}
        className={`relative w-full max-w-md max-h-[90vh] mx-auto p-4 sm:p-6 rounded-xl shadow-xl overflow-auto 
        bg-gray-900 border border-gray-700 text-white`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-xl sm:text-2xl font-bold text-blue-400`}>
            Followers
          </h1>
          <button
            className={`p-1.5 rounded-full border transition-all
              bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-blue-400`}
            onClick={() => navigate(-1)}
            aria-label="Close followers list"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M6.225 6.225a.75.75 0 011.06 0L12 10.94l4.715-4.715a.75.75 0 111.06 1.06L13.06 12l4.715 4.715a.75.75 0 11-1.06 1.06L12 13.06l-4.715 4.715a.75.75 0 11-1.06-1.06L10.94 12 6.225 7.285a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="border-t-2 border-gray-700 pt-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-8"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center bg-red-900/30 border border-red-800 rounded-lg p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-400">{error}</span>
                </div>
              </motion.div>
            ) : Array.isArray(data) ? (
              data.length > 0 ? (
                <motion.div
                  key="followers"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {data.map((follower) => (
                    <motion.div
                      key={follower._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center justify-between p-3 rounded-lg shadow-md transition-all duration-300 
                      bg-gray-800 border border-gray-700 hover:border-blue-400 hover:shadow-blue-900/20`}
                    >
                      <div className="flex items-center">
                        <img
                          src={follower.profileImage}
                          alt={follower.fullName}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 shadow-md transition-transform hover:scale-105 
                          border-blue-500`}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100";
                          }}
                        />
                        <div className="ml-3 sm:ml-4">
                          <Link
                            to={`/home/${
                              follower.userType == "userModel"
                                ? follower._id.toString() ==
                                  loggedinUser.user.userId.toString()
                                  ? "user-dashboard"
                                  : "user" + `/${follower._id}`
                                : follower._id.toString() ==
                                  loggedinUser.user.userId.toString()
                                ? "gym-dashboard"
                                : "gym" + `/${follower._id}`
                            }`}
                            className={`text-sm sm:text-base font-semibold transition-colors text-blue-400 hover:text-blue-300 line-clamp-1`}
                          >
                            {follower.fullName}
                          </Link>
                          {follower.username && (
                            <p className={`text-xs sm:text-sm text-gray-400`}>
                              @{follower.username}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-500 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <div className={`text-gray-400`}>No followers yet</div>
                    <p className={`text-sm mt-1 text-gray-500 max-w-xs`}>
                      When someone follows you, they'll appear here
                    </p>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div
                key="data-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center bg-red-900/30 border border-red-800 rounded-lg p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-400">
                    {typeof data === "string" ? data : "An error occurred"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default FollowersList;
