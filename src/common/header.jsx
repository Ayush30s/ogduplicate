import { FaDumbbell, FaBars, FaTimes, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onLogoutThunk } from "../store/thunk/auth-management";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { useSelector } from "react-redux";
import Notifications from "../Home/notifications/notifications";
import {
  fetchAllRequestThunk,
} from "../store/thunk/requestActionThunk";
import { SocketContext } from "../socket/socketContext";

const Header = ({ userData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [notificationStatus, setShowNotificationStatus] = useState(false);

  const allData = useSelector((store) => store.request);
  const allNotifications = allData.requsetArray;
  let reqCount = 0;
  allNotifications.forEach((nott) => {
    if (nott.status == "pending") reqCount++;
  });

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(onLogoutThunk(dispatch, navigate));
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    dispatch(fetchAllRequestThunk());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-gray-900 z-50 text-white p-4 flex justify-between items-center shadow-lg border-b border-gray-800 sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <FaDumbbell className="text-indigo-400 text-2xl" />
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
          FitZone
        </span>
      </div>

      {/* Mobile Menu Button and Notification Bell */}
      <div className="flex items-center gap-4 md:hidden">
        <div className="relative">
          <div
            className="cursor-pointer"
            onClick={() => setShowNotificationStatus(!notificationStatus)}
          >
            <FaBell className="text-2xl text-white transition-colors duration-200" />
            {reqCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                {reqCount}
              </span>
            )}
          </div>
        </div>
        
        <button
          className="text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex space-x-6 items-center font-medium">
          <Link to="/home">
            <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/home/transformation">
            <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
              Train with AI
            </li>
          </Link>
          <Link to="/blog">
            <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
              Blogs
            </li>
          </Link>

          {/* Notification Bell */}
          <div>
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => setShowNotificationStatus(!notificationStatus)}
              >
                <FaBell className="text-2xl text-white transition-colors duration-200" />
                {reqCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {reqCount}
                  </span>
                )}
              </div>
            </div>

            {/* Notification Panel */}
            <AnimatePresence>
              {notificationStatus && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowNotificationStatus(false)}
                  />
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-800 border-l border-gray-700 shadow-xl z-50 overflow-y-auto"
                  >
                    <Notifications
                      setShowNotificationStatus={setShowNotificationStatus}
                      notificationStatus={notificationStatus}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <span className="truncate max-w-[120px]">
                {userData?.fullName}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  {/* Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={toggleDropdown}
                  />

                  {/* Menu */}
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-full w-64 bg-gray-800 border-l border-gray-700 shadow-xl z-50 overflow-y-auto"
                  >
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium text-indigo-400">Menu</h3>
                      <button
                        onClick={toggleDropdown}
                        className="text-gray-400 hover:text-white"
                      >
                        <FaTimes className="h-6 w-6" />
                      </button>
                    </div>

                    <ul className="py-2">
                      <Link
                        to={
                          userData?.userType === "gymModel"
                            ? "/home/gym-dashboard"
                            : "/home/user-dashboard"
                        }
                        onClick={toggleDropdown}
                      >
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </li>
                      </Link>

                      <Link to="/listing/new" onClick={toggleDropdown}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Post Equipment
                        </li>
                      </Link>

                      <Link to="/listing" onClick={toggleDropdown}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Find Listings
                        </li>
                      </Link>

                      <Link to="/listing/mylisting" onClick={toggleDropdown}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                          My Listings
                        </li>
                      </Link>

                      <Link to="/blog/new" onClick={toggleDropdown}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          New Blog
                        </li>
                      </Link>
                      <Link to="/blog/myBlogs" onClick={toggleDropdown}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          My Blogs
                        </li>
                      </Link>
                      <Link to="/blog/savedblogs" onClick={toggleDropdown}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                          Saved Blogs
                        </li>
                      </Link>
                      <Link to="/blog/likedblogs" onClick={toggleDropdown}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          Liked Blogs
                        </li>
                      </Link>
                      <li
                        className="px-4 py-3 hover:bg-red-600 cursor-pointer text-gray-200 transition-colors flex items-center gap-2 border-t border-gray-700"
                        onClick={() => {
                          handleLogout();
                          toggleDropdown();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </li>
                    </ul>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gray-800 border-l border-gray-700 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-medium text-indigo-400">Menu</h3>
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <ul className="py-2">
                <Link to="/home" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                    Home
                  </li>
                </Link>
                <Link to="/about" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                    About
                  </li>
                </Link>
                <Link to="/home/transformation" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                    Train with AI
                  </li>
                </Link>
                <Link to="/blog" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                    Blogs
                  </li>
                </Link>

                {/* User Profile Section */}
                <div className="px-4 py-3 border-t border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-medium">
                      {userData?.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {userData?.fullName}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to={
                    userData?.userType === "gymModel"
                      ? "/home/gym-dashboard"
                      : "/home/user-dashboard"
                  }
                  onClick={toggleMobileMenu}
                >
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </li>
                </Link>
                {userData?.userType === "userModel" && (
                  <Link to="/listing/new" onClick={toggleMobileMenu}>
                    <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Post Equipment
                    </li>
                  </Link>
                )}
                <Link to="/listing" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Find Listings
                  </li>
                </Link>

                <Link to="/listing/mylisting" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    My Listings
                  </li>
                </Link>

                <Link to="/blog/new" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    New Blog
                  </li>
                </Link>
                <Link to="/blog/myBlogs" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    My Blogs
                  </li>
                </Link>
                <Link to="/blog/savedblogs" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    Saved Blogs
                  </li>
                </Link>
                <Link to="/blog/likedblogs" onClick={toggleMobileMenu}>
                  <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Liked Blogs
                  </li>
                </Link>
                <li
                  className="px-4 py-3 hover:bg-red-600 cursor-pointer text-gray-200 transition-colors flex items-center gap-2 border-t border-gray-700"
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification Panel for Mobile */}
      <AnimatePresence>
        {notificationStatus && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowNotificationStatus(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-800 border-l border-gray-700 shadow-xl z-50 overflow-y-auto"
            >
              <Notifications
                setShowNotificationStatus={setShowNotificationStatus}
                notificationStatus={notificationStatus}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;