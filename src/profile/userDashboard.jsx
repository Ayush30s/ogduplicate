import {
  FaEnvelope,
  FaPhone,
  FaChevronRight,
  FaUser,
  FaCalendarAlt,
  FaEdit,
  FaFire,
  FaDumbbell,
  FaHeartbeat,
} from "react-icons/fa";
import HeatMapComponent from "./heatmap";
import { HiUserGroup, HiOutlineUserAdd } from "react-icons/hi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileDataThuk } from "../store/thunk/profile-management";
import AnalyticsDashboard from "../common/chart";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loading from "../common/loading";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.login);
  let profileData = useSelector((state) => state.profile);
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );

  useEffect(() => {
    if (data?.user?.userType === "userModel") {
      dispatch(profileDataThuk(data.user.userType));
    }
  }, [dispatch, data?.user?.userType]);

  if (profileData.loading) {
    return <Loading />;
  }

  if (profileData.error) {
    return (
      <div className="text-center py-20 text-white bg-gray-900">
        <h1 className="text-2xl font-bold text-red-400">{profileData.error}</h1>
      </div>
    );
  }

  // Safely calculate workout streak
  const workoutStreak =
    profileData?.HeatMap?.reduce((streak, month) => {
      return (
        streak +
        (month?.filter((day) => day?.totalWorkoutTime > 0)?.length || 0)
      );
    }, 0) || 0;

  // Safely calculate total workouts
  const totalWorkouts =
    profileData?.HeatMap?.flat()?.filter((day) => day?.totalWorkoutTime > 0)
      ?.length || 0;

  // Safely calculate average workout time
  const validWorkouts =
    profileData?.HeatMap?.flat()?.filter((day) => day?.totalWorkoutTime > 0) ||
    [];
  const avgWorkoutTime =
    validWorkouts.length > 0
      ? Math.round(
          validWorkouts.reduce(
            (sum, day) => sum + (day?.totalWorkoutTime || 0),
            0
          ) / validWorkouts.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      {/* Hero Banner with Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden shadow-lg mb-8 border border-gray-700"
      >
        {/* Dynamic Gradient Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-12 left-6 z-1">
            <motion.div whileHover={{ scale: 1.05 }} className="relative group">
              <img
                src={profileData?.profileImage || ""}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-4 border-gray-800 shadow-xl object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="pt-20 pb-6 px-6 bg-gray-800">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {profileData?.fullName || "User"}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center text-sm bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full">
                  <FaUser className="mr-2" />
                  {profileData?.userType === "userModel"
                    ? "Athlete"
                    : "Gym Owner"}
                </span>
                <span className="flex items-center text-sm text-gray-400">
                  <FaCalendarAlt className="mr-2" />
                  Joined{" "}
                  {profileData?.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Social Stats with Hover Effects */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate(`/home/gym/${data?.user?.userId}/followersList`)
                }
                className="flex items-center bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl transition-all border border-gray-600"
              >
                <HiUserGroup className="text-blue-400 mr-2" />
                <span className="text-blue-300">Followers:</span>
                <span className="ml-1 font-semibold text-white">
                  {profileData?.followersCount || 0}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate(`/home/gym/${data?.user?.userId}/followingList`)
                }
                className="flex items-center bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl transition-all border border-gray-600"
              >
                <HiOutlineUserAdd className="text-blue-400 mr-2" />
                <span className="text-blue-300">Following:</span>
                <span className="ml-1 font-semibold text-white">
                  {profileData?.followingCount || 0}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (User Stats & Bio) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Card with Edit Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-400">About Me</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/home/profile/edit")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
              >
                <FaEdit />
                Edit Profile
              </motion.button>
            </div>
            <p className="text-gray-300 mb-4 italic">
              {profileData?.bio || "No bio yet. Share your fitness journey!"}
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <FaEnvelope className="text-blue-400 mr-3" />
                <span>{profileData?.email || "Not provided"}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaPhone className="text-blue-400 mr-3" />
                <span>{profileData?.contactNumber || "Not provided"}</span>
              </div>
            </div>
          </motion.div>

          {/* Workout Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Workout Streak */}
            <div className="bg-gray-800 rounded-xl p-4 border border-blue-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-full">
                  <FaFire className="text-orange-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Current Streak</h3>
                  <p className="text-2xl font-bold text-white">
                    {workoutStreak} days
                  </p>
                </div>
              </div>
            </div>

            {/* Total Workouts */}
            <div className="bg-gray-800 rounded-xl p-4 border border-blue-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-full">
                  <FaDumbbell className="text-blue-300 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Total Workouts</h3>
                  <p className="text-2xl font-bold text-white">
                    {totalWorkouts}
                  </p>
                </div>
              </div>
            </div>

            {/* Avg. Workout Time */}
            <div className="bg-gray-800 rounded-xl p-4 border border-blue-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-full">
                  <FaHeartbeat className="text-blue-300 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Avg. Session</h3>
                  <p className="text-2xl font-bold text-white">
                    {avgWorkoutTime} mins
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gym Memberships */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-400">
              My Gym Memberships
            </h2>
          </div>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-auto"
          >
            {profileData?.joinedGym?.length > 0 ? (
              <div className="space-y-3 mt-4">
                {profileData.joinedGym.map((gym, index) => (
                  <Link
                    to={`/home/gym/${gym?._id}`}
                    key={index}
                    className="block bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={gym?.profileImage || ""}
                        alt={gym?.gymName || "Gym"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {gym?.gymName || "Unknown Gym"}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Owned by {gym?.fullName || "Unknown Owner"}
                        </p>
                      </div>
                      <FaChevronRight className="ml-auto text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                You haven't joined any gyms yet.
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Workout Heatmap */}
      <div className="mt-8 p-5 bg-gray-800 rounded-xl border border-gray-700">
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
              <span className="text-xs mr-2 text-gray-400">Intensity:</span>
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
        {profileData?.HeatMap ? (
          <HeatMapComponent profileData={profileData} />
        ) : (
          <div className="text-center py-10 text-gray-400">
            No workout data available
          </div>
        )}
      </div>

      {/* Analytics Charts */}
      {profileData?.exerciseCount?.length > 0 &&
        profileData?.exerciseFreq?.length > 0 && (
          <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 mt-8">
            <AnalyticsDashboard
              darkMode={true}
              title={"Mostly targeted Muscle Graph"}
              labels={profileData.exerciseFreq}
              data={profileData.exerciseCount}
            />
          </div>
        )}

      {profileData?.muscleCount?.length > 0 &&
        profileData?.muscleFreq?.length > 0 && (
          <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 mt-6">
            <AnalyticsDashboard
              darkMode={true}
              title={"Mostly done exercise Graph"}
              labels={profileData.muscleFreq}
              data={profileData.muscleCount}
            />
          </div>
        )}
    </div>
  );
};

export default UserDashboard;
