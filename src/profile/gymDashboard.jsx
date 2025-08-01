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
    if (data?.user?.userType === "gymModel")
      dispatch(profileDataThuk(data.user.userType));
  }, [dispatch, data?.user?.userType]);

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
    console.log(gymData.joinedBy);
    setSearchUser(e.target.value);
    const filteredMemberList = gymData?.joinedBy?.filter((user) => {
      let allMatch = true;
      let searchValue = e.target.value;
      let fullName = user.user?.fullName;
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
      <ShiftPage
        data={showShiftPage}
        setShowShiftPage={setShowShiftPage}
        darkMode={true}
      />
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6 bg-gray-900 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
          Welcome back, {gymData?.fullName?.split(" ")[0]}!
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
            <span>{gymData?.joinedBy?.length || 0} Members</span>
          </div>
          <div className="flex items-center bg-blue-500/20 px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base">
            <Activity className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
            <span>{gymData?.allShifts?.length || 0} Shifts</span>
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

      {/*Gym Profile */}
      <div className="lg:col-span-2 space-y-4 mb-4">
        {/* Gym Profile Card */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <div className="relative flex flex-col align-middle justify-center items-center">
              <img
                src={gymData?.profileImage}
                alt={gymData?.fullName}
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-lg md:rounded-xl object-cover border-4 border-blue-900/50 shadow-md"
              />
              <h1 className="  text-sm text-gray-100">{gymData?.email}</h1>
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
                {gymData?.fullName}
              </h1>
              <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                {gymData?.description}
              </p>

              <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4">
                <div className="flex items-center text-xs md:text-sm bg-gray-700 text-blue-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  {gymData?.location || "Add location"}
                </div>
                <div className="flex items-center text-xs md:text-sm bg-gray-700 text-green-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  {gymData?.contactNumber || "Add contact"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-1 md:mb-4 flex items-center gap-2">
            <Activity className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
            Gym Stats
          </h3>
          <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-4">
            {/* Monthly Membership */}
            <div className="flex flex-1 justify-between items-center p-3 md:p-4 bg-gray-700 rounded-lg md:rounded-xl shadow-sm">
              <div>
                <p className="text-xs md:text-sm text-gray-400">Monthly Fee</p>
                <p className="text-base md:text-xl font-bold text-blue-400">
                  ₹{gymData?.monthlyCharge || "0"}
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
                  {gymData?.followersCount || "0"}
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
                  {gymData?.followingCount || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:gap-6 w-full mx-auto">
        {gymData?.joinedBy?.length > 0 && (
          <div
            className={`w-full ${
              gymData?.allShifts?.length > 0 ? "md:w-1/2" : "md:w-full"
            } bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-700 max-h-64 overflow-auto`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2 mb-2">
                <FaUserFriends className="text-blue-400 w-5 h-5" />
                <span>Members ({gymData?.joinedBy.length})</span>
              </h3>
              <div className="relative w-full md:w-48 lg:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Find members..."
                  value={searchUser}
                  onChange={(e) => handleSearchUser(e)}
                />
                {searchUser && (
                  <button
                    onClick={() => setSearchUser("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-400"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {filteredMembers?.map((user, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 cursor-pointer transition-all duration-200 group"
                  onClick={() => navigate(`/home/user/${user.user._id}`)}
                >
                  <img
                    src={user?.user?.profileImage}
                    alt={user?.user?.fullName}
                    className="w-12 h-12 rounded-full border-2 border-gray-500 object-cover shadow-md group-hover:border-blue-400 transition-all duration-200"
                  />
                  <div>
                    <p className="text-sm md:text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {user?.user?.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      Joined {new Date(user?.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shifts Section - Right */}
        {gymData?.allShifts?.length > 0 && (
          <div
            className={`w-full max-h-64 overflow-auto ${
              gymData?.joinedBy?.length > 0 ? "md:w-1/2" : "md:w-full"
            }`}
          >
            <div className="bg-gray-800 p-4 md:p-6 mt-4 md:mt-0 rounded-xl shadow-sm border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="text-blue-400 w-5 h-5" />
                  <span>Shifts</span>
                </h3>
                <button
                  onClick={() => setShowShiftForm(!showShiftForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  {!showShiftForm && <FaPlus className="w-4 h-4" />}
                  {showShiftForm ? "Cancel" : "New"}
                </button>
              </div>

              {showShiftForm && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                          <Clock className="text-blue-400" size={20} />
                          Create New Shift
                        </h3>
                        <button
                          onClick={() => setShowShiftForm(false)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Gender
                            </label>
                            <select
                              name="sex"
                              value={formData.sex}
                              onChange={handleChange}
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="All">All Genders</option>
                              <option value="Male">Male Only</option>
                              <option value="Female">Female Only</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Member Limit
                            </label>
                            <input
                              type="number"
                              name="limit"
                              value={formData?.limit}
                              onChange={handleChange}
                              min="1"
                              max="100"
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Status
                            </label>
                            <select
                              name="status"
                              value={formData?.status}
                              onChange={handleChange}
                              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowShiftForm(false)}
                            className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                          >
                            Create Shift
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Shift List */}
              <div className="flex flex-col gap-2">
                {gymData?.allShifts?.map((shift, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 cursor-pointer transition-all duration-200 group"
                    onClick={() => setShowShiftPage(shift)}
                  >
                    <div className="w-full flex justify-between items-center gap-2 md:gap-4">
                      <div className="min-w-[80px]">
                        <h4 className="text-sm md:text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                          Shift {index + 1}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-400">
                          {shift?.startTime} - {shift?.endTime}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-1 text-xs md:text-sm rounded-full font-medium whitespace-nowrap ${
                          shift?.status === "Active"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {shift?.status}
                      </span>

                      <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap px-2">
                        {shift?.limit} slots
                      </span>

                      <button className="text-xs md:text-sm text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap">
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* If no members and no shifts */}
        {!gymData?.joinedBy?.length && !gymData?.allShifts?.length && (
          <div className="w-full bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-center">
            <p className="text-gray-400">No members or shifts yet</p>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className=" bg-gray-800 mt-4 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
          <Activity className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Dashboard Overview</span>
        </h2>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-3 md:mb-4">
          <button
            className={`${
              showAnalytics ? "bg-red-500" : "bg-blue-500"
            } text-white py-1.5 px-3 md:py-2 md:px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all text-xs md:text-sm`}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>

          <button
            className={`${
              attendenceReport ? "bg-red-500" : "bg-blue-500"
            } text-white py-1.5 px-3 md:py-2 md:px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all text-xs md:text-sm`}
            onClick={() => setAttendenceReport(!attendenceReport)}
          >
            {attendenceReport ? "Hide Report" : "Show Report"}
          </button>
        </div>

        {showAnalytics && (
          <div className="mt-4 md:mt-6 ">
            <AnalyticsChart
              activeMonth={gymData?.activeMonths}
              darkMode={true}
            />
          </div>
        )}

        {attendenceReport && (
          <div className="mt-4 md:mt-6">
            <AttendanceReport joinedBy={gymData?.joinedBy} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GymDashboard;
