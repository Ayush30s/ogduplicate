import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
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
import RateGym from "./rateGym";
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
  const [followingGymOrNot, setFollowingGymOrNot] = useState("Follow");
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
        setFollowingGymOrNot(data.followingGymOrNot);

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

  const FollowAction = debounce(async () => {
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
  }, [1000]);

  const SendFollowActions = debounce(async () => {
    try {
      const newFollowStatus =
        followingGymOrNot === "Follow" ? "Following" : "Follow";

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

      // When unfollowing, reset all follow request states
      if (newFollowStatus === "Follow") {
        setFollowRequestStatus(-1);
      } else {
        setFollowRequestStatus(1);
      }

      setFollowingGymOrNot(newFollowStatus);
      setFollowersCount((prev) =>
        newFollowStatus === "Following" ? prev + 1 : prev - 1
      );
    } catch (err) {
      console.error("Error updating follow status:", err);
      setError("Failed to update follow status. Please try again.");
    }
  }, [1000]);

  const JoinAction = debounce(async () => {
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
  }, [1000]);

  const SendJoinActions = debounce(async () => {
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
  }, [1000]);

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-red-400 p-4">
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
        <p className="text-lg text-center">{error}</p>
      </div>
    );

  if (message)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-green-400 p-4">
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
        <p className="text-lg text-center">{message}</p>
        <button
          onClick={() => setMessage(null)}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 text-white"
        >
          Continue
        </button>
      </div>
    );

  if (!gymData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-400 p-4">
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
        <p className="text-lg text-center">Gym data not found</p>
      </div>
    );
  }

  const { gymData: gym, showFollowButton, ratingdone } = gymData;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      {/* Hero Section */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-r mb-6">
        <div className="relative flex items-center justify-center px-4 overflow-hidden h-[500px] md:h-[500px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
              alt="Gym Background"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/40"></div>
          </div>

          {/* Days Left - Top Badge */}
          {daysLeft !== null && daysLeft < 10 && (
            <div className="absolute right-3 top-3 md:right-6 md:top-6 animate-pulse">
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg shadow-lg p-3 max-w-xs">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-600"
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
                  <div className="ml-2">
                    <div className="flex items-center">
                      <span className="text-base font-bold text-green-700 mr-1">
                        {daysLeft}
                      </span>
                      <span className="text-base font-semibold text-green-600">
                        {daysLeft === 1 ? "day" : "days"} left
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Renew membership before period ends
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Floating Days Left */}
          {daysLeft !== null && daysLeft < 10 && (
            <div className="lg:hidden fixed bottom-5 right-5 z-20">
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

          {/* Content */}
          <div className="relative space-y-4 w-full max-w-5xl mx-auto text-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white uppercase drop-shadow-lg leading-tight break-words">
              {gym?.gymName}
            </h1>
            <p className="text-gray-100 max-w-2xl mx-auto text-sm sm:text-base md:text-lg drop-shadow-md">
              {gym?.description}
            </p>

            {/* Action Buttons Section */}
            <div className="flex flex-col justify-center items-center gap-4 mt-6">
              {/* Join / Leave Gym */}
              <div className="w-full max-w-md">
                {!joinRequestPending && !joinRequestAccepted && !joinStatus && (
                  <button
                    onClick={JoinAction}
                    className="w-full px-4 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm flex items-center justify-center gap-2"
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
                  <div className="w-full px-4 py-3 rounded-full font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm text-center flex items-center justify-center gap-2">
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
                    className="w-full px-4 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm flex items-center justify-center gap-2"
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
                    className="w-full px-4 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm flex items-center justify-center gap-2"
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

              {/* Attendance Status */}
              {joinStatus && (
                <div className="w-full max-w-md">
                  {attendenceStatus === "Both Marked" ? (
                    <div className="p-3 bg-gradient-to-br from-teal-900/70 to-blue-900/70 rounded-xl border-l-4 border-teal-400 shadow-lg overflow-hidden relative">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-teal-800 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-teal-400 animate-bounce"
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
                        <h3 className="text-center font-semibold text-teal-300">
                          Attendance Recorded
                        </h3>
                      </div>
                      <div className="space-y-1 pl-8">
                        <p className="text-xs text-gray-200">
                          Today's{" "}
                          <span className="font-bold text-teal-300">
                            check-in/out
                          </span>{" "}
                          was successful!
                        </p>
                        <p className="text-xs text-teal-200 italic">
                          See you tomorrow!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <QRScannerButton
                      attendenceStatus={attendenceStatus}
                      setAttendenceStatus={setAttendenceStatus}
                    />
                  )}
                </div>
              )}

              {/* Follow Button */}
              {showFollowButton && (
                <div className="w-full max-w-md">
                  <button
                    onClick={() => {
                      if (followingGymOrNot === "Follow") {
                        FollowAction();
                      } else {
                        SendFollowActions();
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2 ${
                      followingGymOrNot === "Following"
                        ? "bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white"
                        : FollowRequestStatus === 0
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                        : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
                    }`}
                  >
                    {FollowRequestStatus === 0 ? (
                      <>
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
                        Requested
                      </>
                    ) : followingGymOrNot === "Following" ? (
                      <>
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
                        Following
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                        </svg>
                        Follow
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex md:flex-row flex-col gap-2 mb-6">
        <div
          onClick={() => navigate(`/home/gym/${id}/memberList`)}
          className="w-[100%] cursor-pointer bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-400">Members</p>
            </div>
            <p className="text-xl font-bold text-white">{joinCount}</p>
          </div>
        </div>

        <div
          onClick={() => navigate(`/home/gym/${id}/followersList`)}
          className="w-[100%] cursor-pointer bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Heart className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-400">Followers</p>
            </div>
            <p className="text-xl font-bold text-white">{followersCount}</p>
          </div>
        </div>

        <div
          onClick={() => navigate(`/home/gym/${id}/followingList`)}
          className="w-[100%] cursor-pointer bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Heart className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-400">Following</p>
            </div>
            <p className="text-xl font-bold text-white">{followingCount}</p>
          </div>
        </div>
      </div>

      {!ratingdone && !rateLater && joinStatus && (
        <RateGym
          rating={rating}
          setRateLater={setRateLater}
          HandleRating={HandleRating}
          PostRating={PostRating}
        />
      )}

      {/* Gym Details */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border border-gray-700 mb-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-5 pb-2 border-b border-gray-700 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          Gym Details
        </h3>
        <div className="flex flex-wrap md:flex-row flex-col gap-4 mb-6">
          {[
            {
              icon: <Dumbbell className="w-5 h-5 text-white" />,
              label: "Owned by",
              value: gym?.fullName,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              icon: <Mail className="w-5 h-5 text-white" />,
              label: "Email",
              value: gym?.email,
              gradient: "from-purple-500 to-purple-600",
            },
            {
              icon: <Phone className="w-5 h-5 text-white" />,
              label: "Contact",
              value: gym?.contactNumber,
              gradient: "from-green-500 to-green-600",
            },
            {
              icon: <Calendar className="w-5 h-5 text-white" />,
              label: "Established",
              value: gym?.createdAt?.slice(0, 10),
              gradient: "from-orange-500 to-orange-600",
            },
            {
              icon: <MapPin className="w-5 h-5 text-white" />,
              label: "Location",
              value: gym?.street + ", " + gym?.city + ", " + gym?.state,
              gradient: "from-red-500 to-red-600",
            },
            {
              icon: <Clock className="w-5 h-5 text-white" />,
              label: "Monthly Charge",
              value: `₹${gym?.monthlyCharge}/month`,
              gradient: "from-teal-500 to-teal-600",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="md:w-[32%] w-[100%] bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-md`}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    {item.label}
                  </p>
                  <p className="text-white font-semibold text-sm">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 mb-6">
        <h3 className="text-lg font-bold text-white mb-3 pb-2 border-b border-gray-700">
          About the Gym
        </h3>
        <p className="text-gray-300 leading-relaxed text-sm">
          {gym?.description}
        </p>
      </div>

      {/* Members Section */}
      {membersList?.length > 0 && (
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 mb-6">
          <div className="flex flex-col justify-between mb-4 gap-3">
            <h3 className="text-lg font-bold text-white">
              Members ({gym?.joinedBy.length})
            </h3>

            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Members..."
                value={searchUser}
                onChange={(e) => handleSearchUser(e)}
                className="w-full py-2 pl-9 pr-8 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {searchUser && (
                <button
                  onClick={() => setSearchUser("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredMembers?.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => handleNavigateToProfile(user.user)}
              >
                <img
                  src={user.user?.profileImage}
                  alt={user.user?.fullName}
                  className="w-8 h-8 min-w-8 rounded-full border-2 border-gray-500 object-cover shrink-0"
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
          <div className="bg-gray-800 rounded-xl p-5 w-full max-w-md border border-gray-700 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Complete Payment</h3>
              <button
                onClick={() => setShowPaymentGateway(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
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
