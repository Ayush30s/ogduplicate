import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FollowersList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [followersList, setFollowersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggedinUser = useSelector((store) => store.login);

  useEffect(() => {
    const fetchFollowersList = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://gymbackenddddd-1.onrender.com/request/user/followersList/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data.message) {
          setError(data.message);
          setFollowersList([]);
          return;
        }

        setFollowersList(data.userFollowersData || []);
      } catch (err) {
        console.error("Error fetching followers list:", err);
        setError(err.message || "Failed to fetch followers list");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowersList();
  }, [id]);

  console.log(followersList);

  const handleNavigateToProfile = (user) => {
    const isSelf = user._id === loggedinUser.user.userId;
    const basePath =
      user.userType === "userModel"
        ? isSelf
          ? "/home/user-dashboard"
          : `/home/user/${user._id}`
        : isSelf
        ? "/home/gym-dashboard"
        : `/home/gym/${user._id}`;

    navigate(basePath);
  };

  // Close button component to reuse
  const CloseButton = () => (
    <button
      className="absolute top-6 right-6 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-all duration-200 hover:text-white hover:rotate-90"
      onClick={() => navigate(-1)}
      aria-label="Close"
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
  );

  if (followersList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <svg
          className="w-16 h-16 text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <h1 className="text-xl text-gray-400 font-medium">
          No Followers found
        </h1>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          This account doesn't have any followers yet. Be the first to follow!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-5 lg:py-10 px-5">
      <div className="p-5 max-w-2xl mx-auto relative border border-blue-500 rounded-lg">
        {/* Close button - always visible */}
        <CloseButton />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 bg-red-900/30 border border-red-800 rounded-lg p-4 mt-16">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-1">Followers</h1>
              <p className="text-gray-400">
                {followersList.length}{" "}
                {followersList.length === 1 ? "follower" : "followers"}
              </p>
            </div>

            {/* Followers List */}
            <div className="space-y-3">
              {followersList.map((follower) => (
                <div
                  key={follower._id}
                  onClick={() => handleNavigateToProfile(follower)}
                  className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={follower.profileImage || "/default-avatar.png"}
                      alt={follower.fullName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-200"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-white">
                      {follower.fullName}
                    </h2>
                    {follower.username && (
                      <p className="text-sm text-gray-400">
                        @{follower.username}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto text-gray-400 group-hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FollowersList;
