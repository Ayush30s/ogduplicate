import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
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
import PaymentGateway from "../Payment/paymentGateway";
import ShiftsSection from "./shiftSection";

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
  const [daysLeft, setDaysleft] = useState(null);
  const [gymData, setGymData] = useState(location.state?.gymData || null);
  const [loading, setLoading] = useState(!gymData);
  const [rateLater, setRateLater] = useState(false);
  const [joinCount, setJoinCount] = useState(0);
  const [shiftJoinedIndex, setshiftJoinedIndex] = useState(-1);
  const [followersCount, setFollowersCount] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [membersList, setMembersList] = useState([]);
  const [rating, setRating] = useState(0);
  const [searchUser, setSearchUser] = useState("");
  const [filteredMembers, setFilteredMembers] = useState("");
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [attendenceStatus, setAttendenceStatus] = useState("Absent");
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [joinRequestPending, setJoinRequestPending] = useState(false);
  const [joinRequestAccepted, setJoinRequestAccepted] = useState(false);
  const [FollowRequestStatus, setFollowRequestStatus] = useState(-1);
  const [joinStatus, setJoinStatus] = useState(false);

  useEffect(() => {
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

        console.log(data);
        setGymData(data);
        setDaysleft(data.daysLeft);
        setJoinStatus(data.isUserJoined);
        setIsPaymentDone(data.isPaymentDone);
        setMembersList(data.gymData?.joinedBy);
        setFollowingCount(data.followingCount);
        setFollowersCount(data.followersCount);
        setAttendenceStatus(data.attendenceStatus);
        setFilteredMembers(data.gymData?.joinedBy);
        setshiftJoinedIndex(data.shiftJoinedIndex);
        setJoinCount(data?.gymData?.joinedBy?.length);
        setJoinRequestAccepted(data.isJoinRequestAccepted);
        setJoinRequestPending(data.isJoinRequestPending);
        setFollowRequestStatus(data.FollowRequestStatus);
        setIsPaymentDone(data.isPaymentDone || false);

        if (data.isJoinRequestAccepted && !data.isPaymentDone) {
          setShowPaymentGateway(true);
        }
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
  }, [id, navigate, joinRequestAccepted, joinRequestPending, joinStatus]);

  useEffect(() => {
    const handleOwnerAccepted = (data) => {
      if (data.requestType === "follow") {
        if (FollowRequestStatus == 0) {
          SendFollowActions();
        }
      } else {
        // Handle join request acceptance
        setJoinRequestAccepted(true);
        setJoinRequestPending(false);
        setShowPaymentGateway(true);
      }
    };

    const handleOwnerRejected = (data) => {
      if (data.requestType === "follow") {
        if (FollowRequestStatus == 0) {
          setFollowRequestStatus(-1);
        }
      } else {
        // Handle join request rejection
        setJoinRequestAccepted(false);
        setJoinRequestPending(false);
        setShowPaymentGateway(false);
      }
    };

    socket.on("accepted", handleOwnerAccepted);
    socket.on("rejected", handleOwnerRejected);

    return () => {
      socket.off("accepted", handleOwnerAccepted);
      socket.off("rejected", handleOwnerRejected);
    };
  }, [socket, joinRequestPending, FollowRequestStatus]);

  console.log(FollowRequestStatus);

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
      return data;
    } catch (error) {
      console.error("Error posting rating:", error);
      throw error;
    }
  };

  const HandleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const FollowAction = async () => {
    console.log("FollowAction");
    if (FollowRequestStatus == 0) {
      alert("Follow Request is already sent to the user");
      return;
    }

    const followDetails = {
      reqto: id,
      reqby: userId,
      reqbyType: userModelType,
      reqtoType: "gymModel",
      requestType: "follow",
      status: "pending",
    };

    try {
      setFollowRequestStatus(0);
      socket.emit("request", followDetails);

      dispatch(requestActionThunk(followDetails));
      alert("Sending follow request");
    } catch (error) {
      console.error("Error sending follow request:", error);
      setError("Failed to send follow request. Please try again.");
      // Reset pending state on error
      setFollowRequestStatus(-1);
    }
  };

  const SendFollowActions = async () => {
    console.log("sendFollowAction");

    try {
      let newFollowStatus = "";
      if (FollowRequestStatus === 0) {
        newFollowStatus = "Following";
      } else if (FollowRequestStatus === 1) {
        newFollowStatus = "Follow";
      }

      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/request${
          newFollowStatus === "Following"
            ? "/follow/user/" + id
            : "/unfollow/user/" + id
        }`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update follow status");
      }

      // Update all state at once to prevent partial updates
      newFollowStatus == "Follow"
        ? setFollowRequestStatus(-1)
        : setFollowRequestStatus(1);
      console.log(newFollowStatus);
      setFollowersCount((prev) =>
        newFollowStatus === "Following" ? prev + 1 : prev - 1
      );
    } catch (err) {
      console.error("Error updating follow status:", err);
      setError("Failed to update follow status. Please try again.");
    }
  };

  const JoinAction = async () => {
    const data = {
      reqto: id,
      reqby: userId,
      reqbyType: userModelType,
      requestType: "join",
      reqtoType: "gymModel",
      status: "pending",
    };

    try {
      socket.emit("request", data);
      dispatch(requestActionThunk(data));
      setJoinRequestPending(true);
      alert(
        "Your request to join this gym has been sent. You'll be notified when the owner responds."
      );
    } catch (error) {
      console.error("Error sending join request:", error);
      setError("Failed to send join request. Please try again.");
    }
  };

  const SendJoinActions = async () => {
    if (joinStatus === true) {
      setDaysleft(null);
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
        setJoinCount((prev) => prev + 1);
        setJoinStatus(true);
        setShowPaymentGateway(false);
      } else if (data.message === "USER_LEFT_GYM_SUCCESSFUL") {
        setJoinCount((prev) => prev - 1);
        setJoinStatus(false);
        setJoinRequestPending(false);
        setJoinRequestAccepted(false);
        setIsPaymentDone(false);
        setShowPaymentGateway(false);
      }
    } catch (error) {
      console.error("❌ Error in join/leave action:", error.message);
      setError(error.message);
    }
  };

  const handleSearchUser = (e) => {
    setSearchUser(e.target.value);
    const filteredMemberList = membersList.filter((user) => {
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

  const handlePaymentSuccess = () => {
    SendJoinActions();
    setIsPaymentDone(true);
    setShowPaymentGateway(false);
    setJoinRequestAccepted(true);
    setMessage("Payment successful! You are now a member of this gym.");
  };

  const handleNavigateToProfile = (user) => {
    const isCurrentUser = user._id === userData.user.userId;
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

  console.log(daysLeft);

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
        <button
          onClick={() => setMessage(null)}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Continue
        </button>
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

  // make attedence status and follow request

  const {
    gymData: gym,
    followingOrNot,
    userFollowLoggedInUser,
    showFollowButton,
    ratingdone,
  } = gymData;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      {/* Hero Section */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-r mb-8">
        <div className="relative flex items-center justify-center p-4 sm:p-6 md:p-8 mb-5 overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]">
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

          {/* Days Left Component - Responsive Positioning */}
          {daysLeft !== null && (
            <div className="absolute right-2 top-2 sm:right-4 sm:top-4 md:right-5 md:top-5 animate-pulse z-10">
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg shadow-lg p-3 sm:p-4 max-w-xs sm:max-w-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <div className="flex items-center">
                      <span className="text-base sm:text-lg font-bold text-green-700 mr-1 sm:mr-2">
                        {daysLeft}
                      </span>
                      <span className="text-base sm:text-lg font-semibold text-green-600">
                        {daysLeft === 1 ? "day" : "days"} left
                      </span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600">
                      Renew membership before period ends
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Floating Days Left - Appears only when main one is hidden */}
          {daysLeft !== null && (
            <div className="lg:hidden fixed bottom-4 right-4 z-50 sm:hidden">
              <div className="bg-green-600 text-white rounded-full p-3 shadow-xl animate-bounce">
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">{daysLeft}</span>
                  <span className="text-sm">
                    {daysLeft === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="relative z-10 text-center space-y-3 px-2 sm:px-4 md:px-8 w-full">
            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase drop-shadow-lg leading-tight break-words px-2"
              style={{
                textShadow: `
          1px 1px 0 rgba(0,0,0,0.5),
          -1px -1px 0 rgba(0,0,0,0.5),
          1px -1px 0 rgba(0,0,0,0.5),
          -1px 1px 0 rgba(0,0,0,0.5),
          0 1px 0 rgba(0,0,0,0.5),
          1px 0 0 rgba(0,0,0,0.5),
          0 -1px 0 rgba(0,0,0,0.5),
          -1px 0 0 rgba(0,0,0,0.5),
          1px 1px 3px rgba(0,0,0,0.7)
        `,
              }}
            >
              {gym?.gymName}
            </h1>
            <p className="text-gray-100 max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-md px-4">
              {gym?.description}
            </p>
          </div>
        </div>

        {/* Join/Payment Section */}
        <div className="my-8 w-full">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 w-full px-4">
            {/* Join/Leave Gym Section */}
            <div className="w-full lg:flex-1 max-w-md space-y-4">
              {!joinRequestPending && !joinRequestAccepted && !joinStatus && (
                <button
                  onClick={JoinAction}
                  className="w-full px-6 py-3.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Request to Join Gym
                </button>
              )}

              {joinRequestPending && !joinRequestAccepted && !joinStatus && (
                <div className="w-full px-6 py-3.5 rounded-full font-medium bg-gradient-to-r from-amber-500 to-amber-400 text-white text-sm sm:text-base text-center flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 animate-pulse"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Request Pending Approval
                </div>
              )}

              {joinRequestAccepted && !isPaymentDone && !joinStatus && (
                <button
                  onClick={() => setShowPaymentGateway(true)}
                  className="w-full px-6 py-3.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Complete Payment
                </button>
              )}

              {joinStatus && (
                <button
                  onClick={SendJoinActions}
                  className="w-full px-6 py-3.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 text-white text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Leave Gym
                </button>
              )}
            </div>

            {/* Attendance Status Section */}
            {joinStatus && (
              <div className="w-full lg:flex-1 max-w-md">
                {attendenceStatus === "Both Marked" ? (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-l-4 border-green-500 shadow-md overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600 animate-bounce"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Attendance Recorded
                      </h3>
                    </div>
                    <div className="space-y-1 pl-11">
                      <p className="text-gray-700">
                        Today's{" "}
                        <span className="font-bold text-green-600">
                          check-in/out
                        </span>{" "}
                        was successful!
                      </p>
                      <p className="text-sm text-gray-500 italic">
                        See you tomorrow!
                      </p>
                    </div>
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                ) : (
                  <QRScannerButton
                    attendenceStatus={attendenceStatus}
                    setAttendenceStatus={setAttendenceStatus}
                  />
                )}
              </div>
            )}

            {/* Follow Button Section */}
            {showFollowButton && (
              <div className="w-full lg:flex-1 max-w-md">
                <button
                  onClick={() => {
                    if (FollowRequestStatus === -1) FollowAction();
                    else SendFollowActions();
                  }}
                  className={`w-full px-6 py-3.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2 ${
                    FollowRequestStatus === 1
                      ? "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white"
                      : FollowRequestStatus === 0
                      ? "bg-gradient-to-r from-amber-500 to-amber-400 text-white"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                  }`}
                >
                  {FollowRequestStatus === 1 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : FollowRequestStatus === 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 animate-pulse"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                    </svg>
                  )}
                  {FollowRequestStatus === 0
                    ? "Requested"
                    : FollowRequestStatus === 1
                    ? "Following"
                    : "Follow"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                onClick={() => handleNavigateToProfile(user.user)}
              >
                <img
                  src={user.user?.profileImage}
                  alt={user.user?.fullName}
                  className="w-10 h-10 min-w-10 rounded-full border-2 border-gray-500 object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.user?.fullName}
                  </p>
                </div>

                <span className="text-xs text-blue-400 font-medium whitespace-nowrap">
                  View
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shifts Section */}
      {gymData?.allShifts?.length > 0 && (
        <ShiftsSection
          shifts={gymData?.allShifts || []}
          gymId={id}
          userType={userModelType}
          shiftJoinedIndex={shiftJoinedIndex}
          setshiftJoinedIndex={setshiftJoinedIndex}
          joinStatus={joinStatus}
          joinRequestAccepted={joinRequestAccepted}
          isPaymentDone={isPaymentDone}
          setError={setError}
          setMessage={setMessage}
        />
      )}

      {/* Payment Gateway Modal */}
      {showPaymentGateway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Complete Payment</h3>
              <button
                onClick={() => setShowPaymentGateway(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <PaymentGateway
              gymId={id}
              userId={userId}
              setIsPaymentDone={setIsPaymentDone}
              onSuccess={handlePaymentSuccess}
              onClose={() => setShowPaymentGateway(false)}
              monthlyCharge={gym?.monthlyCharge}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GymPage;
