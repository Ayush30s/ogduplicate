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
import { useEffect } from "react";
import Loading from "../common/loading";
import HeatMapComponent from "./heatmap";
import AnalyticsDashboard from "../common/chart";
import { useSelector, useDispatch } from "react-redux";
import { Activity, Target, Trophy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { HiUserGroup, HiOutlineUserAdd } from "react-icons/hi";
import {
  fetchActiveUserDataThunk,
  followRequestThunk,
} from "../store/thunk/userActive-management";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const dispatch = useDispatch();
  const activeUserData = useSelector((store) => store.userActive);
  const loggedInUserData = useSelector((store) => store.login);

  if (loggedInUserData.user.userId == userId) {
    navigate("/home/user-dashboard");
  }

  const {
    userData,
    showEditPage,
    followersCount,
    followingCount,
    exerciseArray,
    musclesNameArray,
    muscleCountArray,
    exerciseNameArray,
    exerciseCountArray,
    totalexerciseDone,
    tottalMuscleTrained,
    loggedInUserFollowMe,
    userFollowLoggedInUser,
    FollowRequestStatus,
    loading,
    error,
  } = activeUserData;

  let activeDays = 0;
  if (activeUserData)
    activeUserData.exerciseArray.reduce(
      (count, month) =>
        count + month.filter((day) => day.totalWorkoutTime > 0).length,
      0
    );

  useEffect(() => {
    dispatch(fetchActiveUserDataThunk(userId));
  }, [dispatch, userId]);

  const handleFollowUser = () => {
    if (loggedInUserFollowMe == true) {
      dispatch(followRequestThunk(`unfollow/user/${userId}`));
    } else {
      dispatch(followRequestThunk(`follow/user/${userId}`));
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 mb-8 overflow-hidden">
        {/* Banner with Profile Image */}
        <div className="relative">
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700" />
          <div className="absolute -bottom-16 left-6">
            <div className="relative group">
              <img
                src={userData?.profileImage}
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
                {userData?.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full">
                  <FaUser className="mr-1" size={12} />
                  {userData?.userType === "userModel"
                    ? "Fitness Enthusiast"
                    : "Gym Owner"}
                </span>
                <span className="flex items-center text-gray-400 text-sm">
                  <FaCalendarAlt className="mr-1" size={12} />
                  Member since{" "}
                  {new Date(userData?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Bio and Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Card */}
            <div className="lg:col-span-2 bg-gray-700/50 p-5 rounded-xl border border-gray-700 relative">
              {/* Social Actions */}
              <div className="flex flex-wrap gap-3 mb-5  pb-5 border-b border-gray-600">
                <button
                  onClick={() => handleFollowUser()}
                  className={`flex text-white ${
                    loggedInUserFollowMe ? "bg-slate-900" : "bg-blue-600"
                  } items-center px-4 py-2 rounded-lg transition-all`}
                >
                  {loggedInUserFollowMe ? "Following" : "Follow"}
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
              <>
                {activeUserData?.showEditPage && (
                  <button className="absolute top-4 right-4 flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-md">
                    <FaEdit className="mr-1" size={12} />
                    Edit Profile
                  </button>
                )}

                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="text-blue-400" />
                  About Me
                </h3>

                <p className="text-gray-300 mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  {userData?.bio || "This user hasn't written a bio yet."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <FaEnvelope className="text-blue-400 mr-3" size={16} />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium text-gray-200">
                        {userData?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <FaPhone className="text-blue-400 mr-3" size={16} />
                    <div>
                      <p className="text-sm text-gray-400">Contact</p>
                      <p className="font-medium text-gray-200">
                        {userData?.contactNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-5 rounded-xl border border-blue-800/30 shadow-sm">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="text-blue-400" />
                Fitness Stats
              </h3>

              <div className="space-y-4">
                {activeUserData?.exerciseArray && (
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-blue-800/30">
                    <div className="flex items-center">
                      <FaFireAlt className="text-orange-400 mr-3" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">Active Days</p>
                        <p className="font-medium text-white">
                          {activeDays + " "}
                          days
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeUserData?.exerciseCountArray?.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-blue-800/30">
                    <div className="flex items-center">
                      <FaDumbbell className="text-blue-400 mr-3" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">
                          Top Muscle Group
                        </p>
                        <p className="font-medium text-white capitalize">
                          {activeUserData?.musclesNameArray[0] || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeUserData?.exerciseCountArray?.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-blue-800/30">
                    <div className="flex items-center">
                      <FaHeartbeat className="text-red-400 mr-3" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">
                          Favorite Exercise
                        </p>
                        <p className="font-medium text-white capitalize">
                          {activeUserData.exerciseNameArray[0] || "N/A"}
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
        {exerciseArray && (
          <div className="px-6 pb-6">
            {/* Workout Heatmap */}
            <div className="mt-4">
              {exerciseArray ? (
                <HeatMapComponent userData={activeUserData} />
              ) : (
                <div className="text-center py-10 text-gray-400">
                  No workout data available
                </div>
              )}
            </div>

            {/* Analytics Charts */}
            {exerciseCountArray?.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="text-blue-400" />
                    Muscle Group Focus
                  </h3>
                  <AnalyticsDashboard
                    darkMode={true}
                    title={"Most targeted Muscles Group"}
                    labels={musclesNameArray}
                    data={muscleCountArray}
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
                    labels={exerciseNameArray}
                    data={exerciseCountArray}
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
