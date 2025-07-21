import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCalendarAlt,
  FaEdit,
  FaDumbbell,
  FaFireAlt,
  FaHeartbeat,
} from "react-icons/fa";
import { HiUserGroup, HiOutlineUserAdd } from "react-icons/hi";
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnalyticsDashboard from "../common/chart";
import HeatMapComponent from "./heatmap";
import { Activity, Target, Trophy } from "lucide-react";
import { SocketContext } from "../socket/socketContext";
import { useSelector, useDispatch } from "react-redux";
import { requestActionThunk } from "../store/thunk/requestActionThunk";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const loggedInUser = useSelector((store) => store.login);
  const loggedInUserId = loggedInUser.user.userId;
  const loggedInUserModelType = loggedInUser.user.userType;
  const [profileData, setProfileData] = useState();
  const [allData, setAllData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [followStatus, setFollowStatus] = useState("");
  const [followersCount, setFollowersCount] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [followRequestPending, setFollowRequestPending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/home/user/${userId}`,
        {
          method: "Get",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.loggedInUserFollowMe) {
        setFollowStatus("Following");
      } else {
        setFollowStatus("Follow");
      }

      setFollowRequestPending(data.isFollowRequestPending);
      setFollowingCount(data.followingCount);
      setFollowersCount(data.followersCount);
      setProfileData(data?.data);
      setAllData(data);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const SendFollowActions = useCallback(async () => {
    const isCurrentlyFollowing = followStatus === "Following";
    const endpoint = isCurrentlyFollowing
      ? `/unfollow/user/${userId}`
      : `/follow/user/${userId}`;
    const newStatus = isCurrentlyFollowing ? "Follow" : "Following";

    try {
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/request${endpoint}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update follow status");
      }

      setFollowStatus(newStatus);
      setFollowersCount((prevCount) =>
        isCurrentlyFollowing ? prevCount - 1 : prevCount + 1
      );
    } catch (err) {
      console.error("Error updating follow status:", err);
      setError("Failed to update follow status. Please try again.");
    }
  }, [followStatus, userId]);

  useEffect(() => {
    socket.on("accepted", () => {
      setFollowRequestPending(false);
      SendFollowActions();
    });

    socket.on("rejected", () => {
      setFollowRequestPending(false);
    });

    return () => {
      socket.off("accepted", () => console.log("socketWillDisconnect"));
      socket.off("rejected", () => console.log("socketWillDisconnect"));
    };
  }, [SendFollowActions, socket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-pulse text-2xl text-blue-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-400 text-xl">{profileData.error}</div>
      </div>
    );
  }

  const FollowAction = () => {
    if (followRequestPending) {
      alert("Wait for the response. Request Already sent!");
      return;
    }

    try {
      const followDetails = {
        reqto: userId,
        reqby: loggedInUserId,
        reqbyType: loggedInUserModelType,
        reqtoType: "userModel",
        requestType: "follow",
        status: "pending",
      };

      socket.emit("request", followDetails);
      dispatch(requestActionThunk(followDetails));
      setFollowRequestPending(true);
      alert("📨 Follow request sent");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      {/* Main Profile Card */}
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 mb-8 overflow-hidden">
        {/* Banner with Profile Image */}
        <div className="relative">
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700" />
          <div className="absolute -bottom-16 left-6">
            <div className="relative group">
              <img
                src={profileData?.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-xl object-cover border-4 border-gray-800 shadow-xl transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl border-4 border-transparent group-hover:border-blue-400/30 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-6 pb-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {profileData?.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full">
                  <FaUser className="mr-1" size={12} />
                  {profileData?.userType === "userModel"
                    ? "Fitness Enthusiast"
                    : "Gym Owner"}
                </span>
                <span className="flex items-center text-gray-400 text-sm">
                  <FaCalendarAlt className="mr-1" size={12} />
                  Member since{" "}
                  {new Date(profileData?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  followStatus == "Follow"
                    ? FollowAction()
                    : SendFollowActions();
                }}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  followStatus === "Following"
                    ? "bg-blue-900/50 text-blue-300 hover:bg-blue-800/50 border border-blue-700/50"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                }`}
              >
                {followRequestPending ? "Requested" : followStatus}
              </button>

              <button
                onClick={() => navigate(`/home/gym/${userId}/followersList`)}
                className="flex items-center bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <HiUserGroup className="text-blue-400 mr-2" size={16} />
                <span className="text-gray-300 mr-1">Followers:</span>
                <span className="font-semibold text-blue-400">
                  {followersCount}
                </span>
              </button>

              <button
                onClick={() => navigate(`/home/gym/${userId}/followingList`)}
                className="flex items-center bg-gray-700 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <HiOutlineUserAdd className="text-blue-400 mr-2" size={16} />
                <span className="text-gray-300 mr-1">Following:</span>
                <span className="font-semibold text-blue-400">
                  {followingCount}
                </span>
              </button>
            </div>
          </div>

          {/* Bio and Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Card */}
            <div className="lg:col-span-2 bg-gray-700/50 p-5 rounded-xl border border-gray-700 relative">
              {allData?.showEditPage && (
                <button
                  onClick={() => setShowEditPage(true)}
                  className="absolute top-4 right-4 flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-md"
                >
                  <FaEdit className="mr-1" size={12} />
                  Edit Profile
                </button>
              )}

              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="text-blue-400" />
                About Me
              </h3>

              <p className="text-gray-300 mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                {profileData?.bio || "This user hasn't written a bio yet."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <FaEnvelope className="text-blue-400 mr-3" size={16} />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-gray-200">
                      {profileData?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <FaPhone className="text-blue-400 mr-3" size={16} />
                  <div>
                    <p className="text-sm text-gray-400">Contact</p>
                    <p className="font-medium text-gray-200">
                      {profileData?.contactNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-5 rounded-xl border border-blue-800/30 shadow-sm">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="text-blue-400" />
                Fitness Stats
              </h3>

              <div className="space-y-4">
                {allData?.exerciseArray && (
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-blue-800/30">
                    <div className="flex items-center">
                      <FaFireAlt className="text-orange-400 mr-3" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">Active Days</p>
                        <p className="font-medium text-white">
                          {allData.exerciseArray.reduce(
                            (count, month) =>
                              count +
                              month.filter((day) => day.totalWorkoutTime > 0)
                                .length,
                            0
                          )}{" "}
                          days
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {allData?.exerciseCount?.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-blue-800/30">
                    <div className="flex items-center">
                      <FaDumbbell className="text-blue-400 mr-3" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">
                          Top Muscle Group
                        </p>
                        <p className="font-medium text-white capitalize">
                          {allData?.muscles[0] || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {allData?.exerciseCount?.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-blue-800/30">
                    <div className="flex items-center">
                      <FaHeartbeat className="text-red-400 mr-3" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">
                          Favorite Exercise
                        </p>
                        <p className="font-medium text-white capitalize">
                          {allData.exercise[0] || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Workout Analytics Section */}
        {allData?.exerciseArray && (
          <div className="px-6 pb-6">
            {/* Workout Heatmap */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-blue-400">
                    Workout Activity Heatmap
                  </h2>
                  <p className="text-sm text-gray-400">
                    Visualization of your workout history
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <span className="text-xs mr-2 text-gray-400">
                      Intensity:
                    </span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                      <div className="w-3 h-3 bg-blue-900/70 rounded-sm"></div>
                      <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              {allData?.exerciseArray ? (
                <HeatMapComponent profileData={allData} />
              ) : (
                <div className="text-center py-10 text-gray-400">
                  No workout data available
                </div>
              )}
            </div>

            {/* Analytics Charts */}
            {allData?.exerciseCount?.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="text-blue-400" />
                    Muscle Group Focus
                  </h3>
                  <AnalyticsDashboard
                    darkMode={true}
                    title={"Most targeted Muscles Group"}
                    labels={allData.muscles}
                    data={allData.muscleCount}
                  />
                </div>

                <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaDumbbell className="text-blue-400" />
                    Exercise Frequency
                  </h3>
                  <AnalyticsDashboard
                    darkMode={true}
                    title={"Most exercised workout"}
                    labels={allData.exercise}
                    data={allData.exerciseCount}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
