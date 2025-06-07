import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { debounce } from "lodash";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  Heart,
  Users,
  Dumbbell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  X,
} from "lucide-react";
import QRScannerButton from "./qrScannerButton";
import { SocketContext } from "../../socket/socketContext";
import { useSelector } from "react-redux";
import { requestActionThunk } from "../../store/thunk/requestActionThunk";

const GymPage = () => {
  const userData = useSelector((store) => store.login);
  const userModelType = userData.user.userType;
  const { userId } = userData.user;
  const socket = useContext(SocketContext);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [attendenceMarked, setAttendenceMarked] = useState(false);
  const [gymData, setGymData] = useState(location.state?.gymData || null);
  const [loading, setLoading] = useState(!gymData);
  const [rateLater, setRateLater] = useState(false);
  const [followStatus, setFollowStatus] = useState("");
  const [joinStatus, setJoinStatus] = useState("");
  const [joinCount, setJoinCount] = useState(0);
  const [shiftJoinedIndex, setshiftJoinedIndex] = useState(-1);
  const [followersCount, setFollowersCount] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [membersList, setMembersList] = useState([]);
  const [rating, setRating] = useState(0);
  const [searchUser, setSearchUser] = useState("");
  const [filteredMembers, setFilteredMembers] = useState("");
  const [attendenceStatus, setAttendenceStatus] = useState(false);
  const [QrScannerResponse, setQrScannerResponse] = useState(null);

  useEffect(() => {
    if (!gymData) {
      const fetchGym = async () => {
        try {
          const response = await fetch(
            `https://gymbackenddddd-1.onrender.com/home/gym/${id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (response.status === 401) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Something went wrong");
          }

          const data = await response.json();
          if (data?.message === "REDIRECT_TO_GYM_DASHBOARD") {
            navigate("/home/gym-dashboard");
          }

          setAttendenceStatus(data.attendenceStatus);
          setJoinCount(data?.gymData?.joinedBy?.length);
          setMembersList(data.gymData?.joinedBy);
          setFilteredMembers(data.gymData?.joinedBy);
          setshiftJoinedIndex(data.shiftJoinedIndex);
          setFollowingCount(data.followingCount);
          setFollowersCount(data.followersCount);
          setFollowStatus(data.followingGymOrNot);
          setJoinStatus(data.isUserJoined);
          setGymData(data);
        } catch (err) {
          if (err.message === "Unauthorized access auth error!") {
            navigate(
              "/home?error=Please sign in to continue and access all features of the application."
            );
          }
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchGym();
    }
  }, [id, navigate, gymData, followStatus, joinStatus, attendenceStatus]);

  const PostRating = async (rating, gymId) => {
    try {
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/home/rating/${gymId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error posting rating:", error);
      throw error;
    }
  };

  const HandleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const SendFollowActions = async () => {
    if (followStatus === "Following") {
      setFollowersCount(followersCount - 1);
    } else {
      setFollowersCount(followersCount + 1);
    }

    const newFollowStatus =
      followStatus === "Following" ? "Follow" : "Following";

    try {
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/request${
          followStatus === "Following"
            ? "/unfollow/user/" + id
            : followStatus === "Follow" && "/follow/user/" + id
        }`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFollowStatus(followStatus);
        throw new Error(data.message || "Failed to update follow status");
      }

      setFollowStatus(newFollowStatus);
    } catch (err) {
      console.error("Error updating follow status:", err);
      setError("Failed to update follow status. Please try again.");
    }
  };

  useEffect(() => {
    socket.on("ownerAccepted", () => {
      SendJoinActions();
    });

    socket.on("ownerRejected", () => {
      return;
    });
  }, [socket]);

  const JoinAction = async () => {
    const data = {
      reqto: id,
      reqby: userId,
      reqbyType: userModelType,
      requestType: "join",
      reqtoType: "gymModel",
      status: "pending",
    };

    socket.emit("request received", data);
    dispatch(requestActionThunk(data));
  };

  const SendJoinActions = async () => {
    if (joinStatus === true) {
      setshiftJoinedIndex(-1);
    }

    try {
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/home/${id}/${
          joinStatus ? "leavegym" : "joingym"
        }`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.message === "USER_JOIN_GYM_SUCCESSFUL") {
        console.log("✅ User joined gym successfully");
        setJoinCount((prev) => prev + 1);
        setJoinStatus(true);
      } else if (data.message === "USER_LEFT_GYM_SUCCESSFUL") {
        console.log("👋 User left gym successfully");
        setJoinCount((prev) => prev - 1);
        setJoinStatus(false);
      }
    } catch (error) {
      console.error("❌ Error in join/leave action:", error.message);
      setError(error.message);
    }
  };

  const JoinShiftRequest = async (shiftId, index) => {
    const response = await fetch(
      `https://gymbackenddddd-1.onrender.com/home/gym/${id}/join-shift/${shiftId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log(response.status);
    if (response.status === 200) {
      setshiftJoinedIndex(index);
      setMessage(data.msg);
    } else {
      setError(data.msg);
    }
  };

  const handleSearchUser = (e) => {
    setSearchUser(e.target.value);
    const filteredMemberList = membersList.filter((user) => {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg">{error}</p>
      </div>
    );

  if (message)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-green-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg">{message}</p>
      </div>
    );

  if (!gymData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg">Gym data not found</p>
      </div>
    );
  }

  const {
    gymData: gym,
    followingOrNot,
    userFollowLoggedInUser,
    showFollowButton,
    ratingdone,
  } = gymData;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      {attendenceMarked && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-80 text-center animate-bounce-in">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Success!</h2>
            <p className="text-gray-600">
              Attendance marked {attendenceStatus ? "In" : "Out"} successfully.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-r mb-8">
        <div
          className="relative flex items-center justify-center p-8 mb-5 overflow-hidden"
          style={{
            height: "300px", // Adjust height as needed
          }}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
              alt="Gym Background"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>

          {/* Content */}
          <div className="relative z-1 text-center space-y-3 px-4">
            <h1
              className="text-[100px] font-bold text-white uppercase drop-shadow-lg"
              style={{
                textShadow: `
                  2px 2px 0 white,
                  -2px -2px 0 white,
                  2px -2px 0 white,
                  -2px 2px 0 white,
                  0 2px 0 white,
                  2px 0 0 white,
                  0 -2px 0 white,
                  -2px 0 0 white,
                  2px 2px 5px white
                `,
              }}
            >
              {gym?.gymName}
            </h1>
            <p className="text-gray-100 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-md">
              {gym?.description}
            </p>
          </div>
        </div>
        <div className="my-6 flex flex-row justify-around items-center">
          <button
            onClick={() => {
              if (!joinStatus) {
                JoinAction();
              } else {
                SendJoinActions();
              }
            }}
            className={`px-12 ml-1 py-2.5 rounded-full font-medium shadow-sm shadow-white hover:scale-105 transition-colors ${
              joinStatus
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {joinStatus ? "Leave Gym" : "Join Gym"}
          </button>

          {joinStatus && (
            <div>
              {QrScannerResponse == "ATTENDANCE_MARKED_OUT_SUCCESSFULLY" ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4 rounded-2xl text-center max-w-lg shadow-xl mt-2 mb-4 border-l-4 border-blue-500 relative ring-1 ring-blue-600/30">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-0.5 rounded-full shadow-md">
                    Daily Limit Reached
                  </div>

                  <button
                    className="bg-gray-700 text-gray-100 px-5 py-3 mt-3 rounded-lg text-base cursor-not-allowed w-full"
                    disabled
                  >
                    ✅ Check-in Completed
                  </button>

                  <p className="mt-4 text-gray-200 text-sm font-medium">
                    You've already checked in and out today. Come back tomorrow!
                  </p>
                </div>
              ) : (
                <div>
                  {QrScannerResponse == "Invalid or expired QR token." ? (
                    <div className="text-red-500 text-lg font-medium m-2">
                      {QrScannerResponse}{" "}
                      <button
                        onClick={() => setQrScannerResponse(null)}
                        className="text-yellow-500"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <QRScannerButton
                      setQrScannerResponse={setQrScannerResponse}
                      attendenceStatus={attendenceStatus}
                      setAttendenceMarked={setAttendenceMarked}
                      setAttendenceStatus={setAttendenceStatus}
                    />
                  )}{" "}
                </div>
              )}
            </div>
          )}

          {showFollowButton && (
            <button
              onClick={SendFollowActions}
              className={`px-12 py-2.5 rounded-full font-medium shadow-sm shadow-white hover:scale-105 transition-colors ${
                followStatus === "Following"
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {followStatus}
            </button>
          )}
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Members Card */}
          <div
            onClick={() => navigate(`/home/gym/${id}/memberList`)}
            className="cursor-pointer bg-gray-800 p-2 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Members</p>
                <p className="text-2xl font-bold text-white">{joinCount}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate(`/home/gym/${id}/followersList`)}
            className="cursor-pointer bg-gray-800 p-2 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Heart className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Followers</p>
                <p className="text-2xl font-bold text-white">
                  {followersCount}
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate(`/home/gym/${id}/followingList`)}
            className="cursor-pointer bg-gray-800 p-2 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Heart className="w-6 h-6 text-blue-400" fill="currentColor" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Following</p>
                <p className="text-2xl font-bold text-white">
                  {followingCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!ratingdone && !rateLater && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Rate This Gym</h3>
            <button
              onClick={() => setRateLater(true)}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => HandleRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600 fill-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              PostRating(rating, id);
              setRateLater(true);
            }}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Submit Rating
          </button>
        </div>
      )}

      {/* Gym Details */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
          Gym Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Dumbbell className="w-5 h-5 text-blue-400" />,
              label: "Owned by",
              value: gym?.fullName,
            },
            {
              icon: <Mail className="w-5 h-5 text-blue-400" />,
              label: "Email",
              value: gym?.email,
            },
            {
              icon: <Phone className="w-5 h-5 text-blue-400" />,
              label: "Contact",
              value: gym?.contactNumber,
            },
            {
              icon: <Calendar className="w-5 h-5 text-blue-400" />,
              label: "Established",
              value: gym?.createdAt?.slice(0, 10),
            },
            {
              icon: <MapPin className="w-5 h-5 text-blue-400" />,
              label: "Location",
              value: gym?.street + ", " + gym?.city + ", " + gym?.state,
            },
            {
              icon: <Clock className="w-5 h-5 text-blue-400" />,
              label: "Monthly Charge",
              value: `₹${gym?.monthlyCharge}/month`,
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-white font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
          About the Gym
        </h3>
        <p className="text-gray-300 leading-relaxed">{gym?.description}</p>
      </div>

      {/* Members Section */}
      {membersList?.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
            <h3 className="text-xl font-bold text-white">
              Members ({gym?.joinedBy.length})
            </h3>

            <div className="relative w-full lg:max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Members..."
                value={searchUser}
                onChange={(e) => handleSearchUser(e)}
                className="w-full py-2.5 pl-10 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchUser && (
                <button
                  onClick={() => setSearchUser("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredMembers?.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => navigate(`/home/user/${user.user._id}`)}
              >
                <img
                  src={user.user.profileImage}
                  alt={user.user.fullName}
                  className="w-10 h-10 rounded-full border-2 border-gray-500 object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {user.user.fullName}
                  </p>
                </div>
                <span className="text-xs text-blue-400 font-medium">View</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shifts Section */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-2xl font-semibold text-blue-400 mb-6">
          {gymData?.allShifts?.length > 0
            ? "Active Shifts"
            : "No Active Shifts"}
        </h3>

        {gymData?.allShifts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gymData.allShifts.map((shift, index) => (
              <div
                key={index}
                className={`p-5 rounded-lg border transition-colors ${
                  shiftJoinedIndex === index
                    ? "border-blue-500 bg-gray-700"
                    : "border-gray-600 bg-gray-700 hover:border-blue-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg font-medium">
                    {shift.sex} Shift
                  </span>
                  <span className="text-sm text-gray-400">
                    Limit: {shift.limit}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-400 my-3">
                  <span>{shift.startTime}</span>
                  <span className="text-gray-500">to</span>
                  <span>{shift.endTime}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-300 pt-3 border-t border-gray-600">
                  <span>
                    Joined:{" "}
                    <span className="text-white font-semibold">
                      {shift?.joinedBy?.length || 0}
                    </span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      shift.status === "Active"
                        ? "bg-green-900/20 text-green-400"
                        : "bg-red-900/20 text-red-400"
                    }`}
                  >
                    {shift.status || "Inactive"}
                  </span>
                </div>

                <div className="pt-4 flex justify-end">
                  {gymData.userType === "OWNER" ? (
                    <button className="text-sm text-blue-400 hover:text-white">
                      View Details
                    </button>
                  ) : (
                    <button
                      onClick={() => JoinShiftRequest(shift?._id, index)}
                      className={`text-sm px-4 py-1.5 rounded-lg ${
                        shiftJoinedIndex === index
                          ? "bg-gray-600 text-gray-300"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {shiftJoinedIndex === index ? "Joined" : "Join Shift"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Currently no shifts available
          </div>
        )}
      </div>
    </div>
  );
};

export default GymPage;
