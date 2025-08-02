import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FollowingList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedinUser = useSelector((store) => store.login);

  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowingList = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:7000/request/user/followingList/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();
        console.log(result);

        if (result.message) {
          setError(result.message);
          setFollowingList([]);
        } else {
          setFollowingList(result.userFollowingData || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch following list");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingList();
  }, [id]);

  console.log(followingList);
  const handleNavigateToProfile = (user) => {
    const isCurrentUser = user._id === loggedinUser.user.userId;
    const path =
      user.userType === "userModel"
        ? isCurrentUser
          ? "/home/user-dashboard"
          : `/home/user/${user._id}`
        : isCurrentUser
        ? "/home/gym-dashboard"
        : `/home/gym/${user._id}`;

    navigate(path);
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

  return (
    <div className="bg-gray-900 min-h-screen py-5 lg:py-10 px-5">
      <div className="max-w-2xl mx-auto relative border border-blue-500 rounded-lg p-5">
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
        ) : followingList.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16">
            <svg
              className="w-16 h-16 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <h1 className="text-xl text-gray-400 font-medium">
              Not following anyone yet
            </h1>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              When you follow someone, they'll appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-1">Following</h1>
              <p className="text-gray-400">
                {followingList.length}{" "}
                {followingList.length === 1 ? "person" : "people"}
              </p>
            </div>

            {/* Following List */}
            <div className="space-y-3">
              {followingList.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleNavigateToProfile(user)}
                  className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200 cursor-pointer group"
                >
                  <img
                    src={user.profileImage || "/default-avatar.png"}
                    alt={user.fullName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-200"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-white">
                      {user.fullName}
                    </h2>
                    {user.username && (
                      <p className="text-sm text-gray-400">@{user.username}</p>
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

export default FollowingList;
