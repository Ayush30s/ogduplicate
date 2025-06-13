import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTimes,
  FaPlus,
  FaUserFriends,
  FaQrcode,
  FaBell,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  profileDataThuk,
  createNewShiftThunk,
} from "../store/thunk/profile-management";
import QRCodeGenerator from "../Home/Gym/qrCode";
import AnalyticsChart from "../common/barGraph";
import ShiftPage from "../Home/Gym/shiftDetail";
import AttendanceReport from "../Home/Gym/attendenceReport";
import {
  Users,
  Phone,
  MapPin,
  Clock,
  Award,
  Calendar,
  Activity,
} from "lucide-react";

const GymDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.login);
  const gymData = useSelector((state) => state.profile);
  const gymId = data?.user?.userId;

  useEffect(() => {
    if (data.user.userType === "gymModel")
      dispatch(profileDataThuk(data.user.userType));
  }, [dispatch, data.user.userType]);

  const [showShiftForm, setShowShiftForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [attendenceReport, setAttendenceReport] = useState(false);
  const [showShiftPage, setShowShiftPage] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(gymData?.joinedBy);
  const [formData, setFormData] = useState({
    sex: "All",
    limit: 20,
    startTime: "06:00",
    endTime: "07:00",
    status: "Active",
  });

  const handleSearchUser = (e) => {
    setSearchUser(e.target.value);
    const filteredMemberList = gymData?.joinedBy?.filter((user) => {
      let allMatch = true;
      let searchValue = e.target.value;
      let fullName = user.user.fullName;
      for (let index = 0; index < searchValue.length; index++) {
        if (
          searchValue[index]?.toUpperCase() !== fullName[index]?.toUpperCase()
        ) {
          allMatch = false;
          break;
        }
      }
      return allMatch;
    });
    setFilteredMembers(filteredMemberList);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      createNewShiftThunk({ formData: formData, userId: data?.user?.userId })
    );
    setShowShiftForm(false);
  };

  if (showShiftPage) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gray-900">
        <button
          onClick={() => setShowShiftPage(null)}
          className="mb-4 flex items-center gap-2 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <ShiftPage data={showShiftPage} darkMode={true} />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6 bg-gray-900 min-h-screen">
      {/* Welcome Header */}
      <div className="relative mb-6 md:mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
          Welcome back, {gymData.fullName?.split(" ")[0]}!
        </h1>
        <p className="text-blue-200 text-sm md:text-base">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="flex flex-wrap items-center mt-4 gap-2 md:gap-4">
          <div className="flex items-center bg-blue-500/20 px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base">
            <Users className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
            <span>{gymData.joinedBy?.length || 0} Members</span>
          </div>
          <div className="flex items-center bg-blue-500/20 px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base">
            <Activity className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
            <span>{gymData.allShifts?.length || 0} Shifts</span>
          </div>
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="flex items-center gap-1 md:gap-2 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base"
          >
            <FaQrcode className="w-4 h-4 md:w-5 md:h-5" />
            <span>{showQRCode ? "Hide QR" : "Show QR"}</span>
          </button>
        </div>
      </div>

      {/* QR Code Section */}
      {showQRCode && (
        <div className="mb-6 p-4 md:p-6 bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border border-blue-900/50 flex flex-col items-center">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">
            Attendance QR Code
          </h3>
          <p className="text-gray-400 mb-3 md:mb-4 text-center text-sm md:text-base">
            Scan this QR code with your mobile device to check in to the gym
          </p>
          <QRCodeGenerator gymId={gymId} sessionId={"general"} />
          <button
            onClick={() => setShowQRCode(false)}
            className="mt-3 md:mt-4 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm md:text-base"
          >
            Close QR Code
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Gym Profile */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Gym Profile Card */}
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              <div className="relative">
                <img
                  src={gymData.profileImage}
                  alt={gymData.fullName}
                  className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-lg md:rounded-xl object-cover border-4 border-blue-900/50 shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 bg-blue-500 text-white p-1 md:p-2 rounded-full shadow-lg">
                  <Award className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="flex-1 relative bg-gray-800 p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-gray-700 w-full">
                <button
                  onClick={() => navigate("/home/profile/edit")}
                  className="absolute top-2 right-2 md:top-4 md:right-4 text-xs md:text-sm rounded-sm bg-gray-700 shadow-sm shadow-blue-900/50 text-blue-400 px-2 py-1 font-bold hover:bg-gray-600"
                >
                  Edit
                </button>

                {/* Gym Info */}
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {gymData.fullName}
                </h1>
                <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                  {gymData.description}
                </p>

                <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4">
                  <div className="flex items-center text-xs md:text-sm bg-gray-700 text-blue-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {gymData.location || "Add location"}
                  </div>
                  <div className="flex items-center text-xs md:text-sm bg-gray-700 text-green-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {gymData.contactNumber || "Add contact"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
              <Activity className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
              Gym Stats
            </h3>
            <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-4">
              {/* Monthly Membership */}
              <div className="flex flex-1 justify-between items-center p-3 md:p-4 bg-gray-700 rounded-lg md:rounded-xl shadow-sm">
                <div>
                  <p className="text-xs md:text-sm text-gray-400">
                    Monthly Fee
                  </p>
                  <p className="text-base md:text-xl font-bold text-blue-400">
                    ₹{gymData.monthlyCharge || "0"}
                  </p>
                </div>
                <div className="bg-gray-600 p-2 md:p-3 rounded-md md:rounded-lg">
                  <Calendar className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
                </div>
              </div>

              {/* Followers */}
              <div className="flex flex-1 items-center justify-between p-3 md:p-4 bg-gray-700 rounded-lg md:rounded-xl shadow-sm">
                <div
                  onClick={() =>
                    navigate(`/home/gym/${data.user.userId}/followersList`)
                  }
                  className="cursor-pointer"
                >
                  <p className="text-xs md:text-sm text-gray-400">Followers</p>
                  <p className="text-base md:text-lg font-bold text-green-400">
                    {gymData.followersCount || "0"}
                  </p>
                </div>
              </div>

              {/* Following */}
              <div className="flex flex-1 items-center justify-between p-3 md:p-4 bg-gray-700 rounded-lg md:rounded-xl shadow-sm">
                <div
                  onClick={() =>
                    navigate(`/home/gym/${data.user.userId}/followingList`)
                  }
                  className="cursor-pointer"
                >
                  <p className="text-xs md:text-sm text-gray-400">Following</p>
                  <p className="text-base md:text-lg font-bold text-purple-400">
                    {gymData.followingCount || "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Shift Management */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-700">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Shift Management</span>
              </h3>
              <button
                onClick={() => setShowShiftForm(!showShiftForm)}
                className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm md:text-base"
              >
                <FaPlus className="w-3 h-3 md:w-4 md:h-4" />
                {showShiftForm ? "Cancel" : "New Shift"}
              </button>
            </div>

            {showShiftForm && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 border border-blue-900/50 rounded-lg bg-gray-700">
                <h4 className="text-sm md:text-md font-medium text-center mb-3 md:mb-4 text-blue-400">
                  Create New Shift
                </h4>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 md:space-y-4"
                >
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">
                        Gender
                      </label>
                      <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                      >
                        <option value="All">All Genders</option>
                        <option value="Male">Male Only</option>
                        <option value="Female">Female Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">
                        Member Limit
                      </label>
                      <input
                        type="number"
                        name="limit"
                        value={formData?.limit}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData?.status}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 md:px-4 md:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 md:mt-4 py-1.5 px-3 md:py-2.5 md:px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-md text-sm md:text-base"
                  >
                    Create Shift
                  </button>
                </form>
              </div>
            )}

            {/* Shift List */}
            <div className="flex flex-col gap-2 md:gap-4 overflow-auto max-h-[300px] md:max-h-[470px]">
              {gymData?.allShifts?.map((shift, index) => (
                <div
                  key={index}
                  className="group w-full p-3 md:p-4 bg-gray-700 hover:bg-gray-600 rounded-lg md:rounded-xl border border-gray-600 transition-colors cursor-pointer"
                  onClick={() => setShowShiftPage(shift)}
                >
                  <div className="flex justify-between items-center flex-wrap gap-2 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white group-hover:text-blue-400 text-sm md:text-base">
                        Shift {index + 1}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-400">
                        {shift?.startTime} - {shift?.endTime}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 md:px-3 md:py-1 text-xs rounded-full font-medium ${
                        shift?.status === "Active"
                          ? "bg-green-900/20 text-green-400"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {shift?.status}
                    </span>
                    <span className="text-xs md:text-sm text-gray-400">
                      {shift?.limit} slots
                    </span>
                    <button className="text-xs text-blue-400 hover:text-blue-300">
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      {gymData.joinedBy?.length > 0 && (
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-700 mt-6 md:mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2 mb-2 md:mb-0">
              <FaUserFriends className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">
                Members ({gymData.joinedBy.length})
              </span>
            </h3>
            <div className="relative w-full md:w-48 lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-8 md:pl-10 pr-8 md:pr-10 py-1.5 md:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="Find members..."
                value={searchUser}
                onChange={(e) => handleSearchUser(e)}
              />
              {searchUser && (
                <button
                  onClick={() => setSearchUser("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <FaTimes className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredMembers?.map((user, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-between p-2 md:p-3 bg-gray-700 hover:bg-gray-600 rounded-lg md:rounded-xl transition-all cursor-pointer border border-gray-600 shadow-sm"
                onClick={() => navigate(`/home/user/${user.user._id}`)}
              >
                <img
                  src={user.user.profileImage}
                  alt={user.user.fullName}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border border-gray-500 shadow-sm object-cover"
                />

                {/* Info - Right */}
                <div className="text-right ml-2">
                  <p className="text-xs md:text-sm font-semibold text-white">
                    {user.user.fullName}
                  </p>
                  <p className="text-xs text-gray-400">
                    Joined {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <div className="mt-6 md:mt-8 bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
          <Activity className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Dashboard Overview</span>
        </h2>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-4">
          <button
            className="bg-blue-500 text-white py-1.5 px-3 md:py-2 md:px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all text-xs md:text-sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>

          <button
            className="bg-blue-500 text-white py-1.5 px-3 md:py-2 md:px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all text-xs md:text-sm"
            onClick={() => setAttendenceReport(!attendenceReport)}
          >
            {attendenceReport ? "Hide Report" : "Show Report"}
          </button>
        </div>

        {showAnalytics && (
          <div className="mt-4 md:mt-6 bg-gray-900 p-4 md:p-6 rounded-lg md:rounded-xl shadow-md border border-gray-600 transition-opacity duration-300">
            <AnalyticsChart
              activeMonth={gymData?.activeMonths}
              darkMode={true}
            />
          </div>
        )}

        {attendenceReport && (
          <div className="mt-4 md:mt-6 bg-gray-900 p-4 md:p-6 rounded-lg md:rounded-xl shadow-md border border-gray-600 transition-opacity duration-300">
            <AttendanceReport joinedBy={gymData?.joinedBy} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GymDashboard;
