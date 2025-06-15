import { useSelector, useDispatch } from "react-redux";
import { FaBell, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  fetchAllRequestThunk,
  deleteNotificationThunk,
  changeRequestStatusThunk,
} from "../../store/thunk/requestActionThunk";
import { SocketContext } from "../../socket/socketContext";

const Notifications = ({ setShowNotificationStatus, notificationStatus }) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const allData = useSelector((store) => store.request);
  const loggedInUser = useSelector((store) => store.login);
  const allNotifications = allData.requsetArray;
  const loading = allData.loading;
  const error = allData.error;

  const [activeTab, setActiveTab] = useState("received");
  const [statusFilter, setStatusFilter] = useState("all");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    dispatch(fetchAllRequestThunk(activeTab));
  }, [activeTab, dispatch]);

  const handleTabChange = (tab) => {
    setShow(false);
    setActiveTab(tab);
    setStatusFilter("all"); // Reset status filter when changing main tab
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-300";
      case "accepted":
        return "bg-green-900 text-green-300";
      case "rejected":
      case "ignored":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-700 text-white";
    }
  };

  const getTabColor = (tab) => {
    return tab === "received" ? "indigo" : "purple";
  };

  const filteredNotifications = allNotifications?.filter((notification) => {
    if (statusFilter === "all") return true;
    return notification.status === statusFilter;
  });

  const handleChangeRequestStatus = (notification, status) => {
    const { requestType, reqby, reqto, _id } = notification;

    if (status == "accepted") {
      socket.emit("request accepted", {
        requestId: _id,
        from: reqto,
        to: reqby,
        status: status,
      });

      const data = {
        requestId: _id,
        status: "accepted",
      };

      dispatch(changeRequestStatusThunk(data));
    } else {
      socket.emit("request rejected", {
        requestId: _id,
        from: reqto,
        to: reqby,
        status: status,
      });

      const data = {
        requestId: _id,
        status: "rejected",
      };

      dispatch(changeRequestStatusThunk(data));
    }

    setTimeout(() => {
      dispatch(fetchAllRequestThunk());
    }, 6000);
  };

  const handleDelete = (notification) => {
    dispatch(deleteNotificationThunk(notification));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 z-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto -z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
            <FaBell className="text-indigo-400" />
            Notifications
          </h2>
          <button
            onClick={() => setShowNotificationStatus(!notificationStatus)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close notifications"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Main Tabs */}
        <div className="flex justify-center space-x-4 border-b border-gray-700 py-2 bg-gray-900">
          {["received", "sent"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded ${
                activeTab === tab
                  ? `bg-${getTabColor(tab)}-500 text-white`
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex justify-center space-x-2 border-b border-gray-700 py-2 bg-gray-800">
          {["all", "pending", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                statusFilter === status
                  ? `bg-${getTabColor(activeTab)}-600 text-white`
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filteredNotifications?.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-lg">
            No {statusFilter === "all" ? "" : statusFilter + " "}notifications{" "}
            {activeTab === "received" ? "received" : "sent"}
          </div>
        ) : (
          <ul className="divide-y divide-gray-700 max-h-[70vh] overflow-y-auto">
            {show &&
              filteredNotifications?.map((notification) => {
                const shouldRender =
                  notification.reqby === loggedInUser.user.userId
                    ? !notification.reqbyRemove
                    : !notification.reqtoRemove;

                return (
                  shouldRender && (
                    <motion.li
                      key={notification?._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 hover:bg-gray-750 transition-colors ${
                        activeTab === "received"
                          ? "border-l-4 border-indigo-500"
                          : "border-l-4 border-purple-500"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`rounded-full p-3 flex-shrink-0 ${
                            activeTab === "received"
                              ? "bg-indigo-500"
                              : "bg-purple-500"
                          }`}
                        >
                          <FaBell className="text-white text-base" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-bold text-white text-lg mb-1">
                                {notification.requestType === "join" ? (
                                  <Link
                                    to={
                                      activeTab === "received"
                                        ? `/home/${
                                            notification.reqbyType ===
                                            "gymModel"
                                              ? "gym"
                                              : "user"
                                          }/${notification.reqby?._id}`
                                        : `/home/${
                                            notification.reqtoType ===
                                            "gymModel"
                                              ? "gym"
                                              : "user"
                                          }/${notification.reqto?._id}`
                                    }
                                  >
                                    <span
                                      className={
                                        activeTab === "received"
                                          ? "text-indigo-300"
                                          : "text-purple-300"
                                      }
                                    >
                                      {activeTab === "received"
                                        ? notification.reqby?.fullName
                                        : notification.reqto?.fullName}
                                    </span>{" "}
                                    <span className="text-sm font-light">
                                      {activeTab === "received"
                                        ? "wants to join your gym"
                                        : "You sent a join request"}
                                    </span>
                                  </Link>
                                ) : (
                                  "New Equipment Request"
                                )}
                              </h3>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap mt-1">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </span>
                          </div>

                          {/* Status + Buttons */}
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <div className="flex items-center">
                              <span className="text-gray-400 text-sm mr-2">
                                Status:
                              </span>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyles(
                                  notification.status
                                )}`}
                              >
                                {notification.status}
                              </span>
                            </div>

                            <div className="flex gap-2 items-center">
                              {activeTab === "received" &&
                                notification.status === "pending" && (
                                  <>
                                    <button
                                      className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                                      onClick={() =>
                                        handleChangeRequestStatus(
                                          notification,
                                          "accepted"
                                        )
                                      }
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                                      onClick={() =>
                                        handleChangeRequestStatus(
                                          notification,
                                          "rejected"
                                        )
                                      }
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                              {(notification.status === "accepted" ||
                                notification.status === "rejected") && (
                                <button
                                  onClick={() => handleDelete(notification)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete notification"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  )
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
