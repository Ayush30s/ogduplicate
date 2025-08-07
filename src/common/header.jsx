import {
  FaDumbbell,
  FaBars,
  FaTimes,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onLogoutThunk } from "../store/thunk/auth-management";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { useSelector } from "react-redux";
import Notifications from "../Home/notifications/notifications";
import { fetchAllRequestThunk } from "../store/thunk/requestActionThunk";
import { SocketContext } from "../socket/socketContext";

const Header = ({ userData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [notificationStatus, setShowNotificationStatus] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [listingDropdownOpen, setListingDropdownOpen] = useState(false);

  const allData = useSelector((store) => store.request);
  const allNotifications = allData?.requsetArray;
  let reqCount = 0;
  allNotifications.forEach((nott) => {
    if (nott?.status == "pending") reqCount++;
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
    <header className="bg-gray-900 z-999 text-white p-4 flex justify-between items-center shadow-lg border-b border-gray-800 sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <FaDumbbell className="text-indigo-400 text-2xl" />
        <Link to="/home">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
            OnlyGym
          </span>
        </Link>
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
          {userData?.userType === "userModel" && (
            <Link to="/home/transformation">
              <li className="text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer">
                Train with AI
              </li>
            </Link>
          )}

          {/* Blog Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 text-gray-300 hover:text-indigo-400 transition-colors"
              onMouseEnter={() => setBlogDropdownOpen(true)}
              onMouseLeave={() => setBlogDropdownOpen(false)}
            >
              Blogs
              <FaChevronDown
                className={`text-xs transition-transform ${
                  blogDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {blogDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700"
                  onMouseEnter={() => setBlogDropdownOpen(true)}
                  onMouseLeave={() => setBlogDropdownOpen(false)}
                >
                  <div className="py-1">
                    <Link
                      to="/blog"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      All Blogs
                    </Link>
                    <Link
                      to="/blog/new"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      New Blog
                    </Link>
                    <Link
                      to="/blog/myBlogs"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      My Blogs
                    </Link>
                    <Link
                      to="/blog/savedblogs"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Saved Blogs
                    </Link>
                    <Link
                      to="/blog/likedblogs"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Liked Blogs
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Listing Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 text-gray-300 hover:text-indigo-400 transition-colors"
              onMouseEnter={() => setListingDropdownOpen(true)}
              onMouseLeave={() => setListingDropdownOpen(false)}
            >
              Listings
              <FaChevronDown
                className={`text-xs transition-transform ${
                  listingDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {listingDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700"
                  onMouseEnter={() => setListingDropdownOpen(true)}
                  onMouseLeave={() => setListingDropdownOpen(false)}
                >
                  <div className="py-1">
                    <Link
                      to="/listing"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Find Listings
                    </Link>
                    {
                      <Link
                        to="/listing/new"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Post Equipment
                      </Link>
                    }
                    <Link
                      to="/listing/mylisting"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      My Listings
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                {userData?.userType === "userModel" && (
                  <Link to="/home/transformation" onClick={toggleMobileMenu}>
                    <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                      Train with AI
                    </li>
                  </Link>
                )}

                {/* Blog Section */}
                <div className="border-t border-gray-700">
                  <button
                    className="w-full px-4 py-3 text-left flex justify-between items-center text-gray-200 hover:bg-gray-700"
                    onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
                  >
                    <span>Blogs</span>
                    <FaChevronDown
                      className={`text-xs transition-transform ${
                        blogDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {blogDropdownOpen && (
                    <div className="pl-6">
                      <Link to="/blog" onClick={toggleMobileMenu}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                          All Blogs
                        </li>
                      </Link>
                      <Link to="/blog/new" onClick={toggleMobileMenu}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                          New Blog
                        </li>
                      </Link>
                      <Link to="/blog/myBlogs" onClick={toggleMobileMenu}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                          My Blogs
                        </li>
                      </Link>
                      <Link to="/blog/savedblogs" onClick={toggleMobileMenu}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                          Saved Blogs
                        </li>
                      </Link>
                      <Link to="/blog/likedblogs" onClick={toggleMobileMenu}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                          Liked Blogs
                        </li>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Listing Section */}
                <div className="border-t border-gray-700">
                  <button
                    className="w-full px-4 py-3 text-left flex justify-between items-center text-gray-200 hover:bg-gray-700"
                    onClick={() => setListingDropdownOpen(!listingDropdownOpen)}
                  >
                    <span>Listings</span>
                    <FaChevronDown
                      className={`text-xs transition-transform ${
                        listingDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {listingDropdownOpen && (
                    <div className="pl-6">
                      <Link to="/listing" onClick={toggleMobileMenu}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                          Find Listings
                        </li>
                      </Link>
                      {
                        <Link to="/listing/new" onClick={toggleMobileMenu}>
                          <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                            Post Equipment
                          </li>
                        </Link>
                      }
                      <Link to="/listing/mylisting" onClick={toggleMobileMenu}>
                        <li className="px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-200 transition-colors">
                          My Listings
                        </li>
                      </Link>
                    </div>
                  )}
                </div>

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
