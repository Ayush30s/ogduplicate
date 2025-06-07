import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FollowingList = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loggedinUser = useSelector((store) => store.login);

  useEffect(() => {
    const FetchFollowingList = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://gymbackenddddd-1.onrender.com/request/user/followingList/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const FollowingData = await response.json();
        console.log(FollowingData);
        setData(FollowingData.followingUsers);
      } catch (err) {
        console.error("Error fetching following list:", err);
        setError(err.message || "Failed to fetch following list");
      } finally {
        setLoading(false);
      }
    };

    FetchFollowingList();
  }, [id]);

  return (
    <div
      className={`relative w-[40%] max-h-[90vh] mt-5 mx-auto p-4 rounded-xl shadow-xl overflow-auto bg-gray-900 border border-gray-700 text-white`}
    >
      <h1 className={`text-2xl font-bold mb-4 text-left text-blue-400`}>
        Following
      </h1>
      <button
        className={`absolute right-4 top-5 p-1 rounded-full border transition-all
          bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-blue-400`}
        onClick={() => navigate(-1)}
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

      <div className="border-t-2 border-gray-700 pt-5">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <h1 className={`text-red-400`}>{error}</h1>
          </div>
        ) : Array.isArray(data) ? (
          data.length > 0 ? (
            <div className="space-y-4">
              {data.map((following) => (
                <div
                  key={following._id}
                  className={`flex flex-row justify-between items-center p-3 rounded-lg shadow-md transition-all duration-300 
                 bg-gray-800 border border-gray-700 hover:border-blue-400 hover:shadow-blue-900/20
                  `}
                >
                  <img
                    src={following.profileImage}
                    alt={following.fullName}
                    className={`w-12 h-12 rounded-full object-cover border-2 shadow-md transition-transform hover:scale-105 
                   border-blue-500`}
                  />
                  <div className="ml-4">
                    <Link
                      to={`/home/${
                        following.userType == "userModel"
                          ? following._id.toString() ==
                            loggedinUser.user.userId.toString()
                            ? "user-dashboard"
                            : "user" + `/${following._id}`
                          : following._id.toString() ==
                            loggedinUser.user.userId.toString()
                          ? "gym-dashboard"
                          : "gym" + `/${following._id}`
                      }`}
                      className={`text-lg font-semibold transition-colors text-blue-400 hover:text-blue-300`}
                    >
                      {following.fullName}
                    </Link>

                    {following.username && (
                      <p className={`text-sm text-gray-400`}>
                        @{following.username}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className={`text-lg text-gray-400`}>No Followers found</div>
              <p className={`mt-2 text-gray-500`}>
                following profile will here .
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <h1 className={`text-red-400`}>
              {typeof data === "string" ? data : "An error occurred"}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingList;
