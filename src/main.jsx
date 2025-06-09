import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Home from "./Home/home.jsx";
import Blogs from "./blogs/blog.jsx";
import SignIn from "./login/signin.jsx";
import MyBlogs from "./blogs/myBlogs.jsx";
import BlogPage from "./blogs/blogPage.jsx";
import AllBlogs from "./blogs/allBlogs.jsx";
import GymPage from "./Home/Gym/gymPage.jsx";
import FrontPage from "./Home/frontPage.jsx";
import TextEditor from "./blogs/writeBlogs.jsx";
import SavedBlogs from "./blogs/savedBlogs.jsx";
import LikedBlogs from "./blogs/likedBlogs.jsx";
import MyListing from "./listing/myListing.jsx";
import Unauthorized from "./errors/unAuth.jsx";
import RegisterPage from "./login/registerPage.jsx";
import RegisterUser from "./login/registerUser.jsx";
import UserProfile from "./profile/userProfile.jsx";
import MemberList from "./Home/List/memberList.jsx";
import RegisterOwner from "./login/registerOwner.jsx";
import GymDashboard from "./profile/gymDashboard.jsx";
import AuthAccessGuard from "./guards/authAccessGuard.jsx";
import Transformation from "./Home/Exercise/transformation.jsx";
import UserDashboard from "./profile/userDashboard.jsx";
import CreateListingPage from "./listing/postListing.jsx";
import FollowersList from "../src/Home/List/followersList.jsx";
import FollowingList from "../src/Home/List/followingList.jsx";
import AboutPage from "./Home/about.jsx";
import Listing from "./listing/listing.jsx";
import AllListing from "./listing/allListings.jsx";
import ProtectedRoute from "./Home/protectedRoute.jsx";
import ListingPage from "./listing/listingPage.jsx";
import EditListingPage from "./listing/editListing.jsx";
import ErrorBoundary from "./common/errorBoundary.jsx";
import EditPersonalDetails from "./profile/editProfile.jsx";
import UserTypeAccess from "./errors/userType.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Unprotected Routes
      { path: "/", element: <SignIn /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/register/user", element: <RegisterUser /> },
      { path: "/register/owner", element: <RegisterOwner /> },

      // Protected Routes
      {
        path: "/about",
        element: (
          <ProtectedRoute>
            <AboutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <ErrorBoundary>
            <ProtectedRoute>
              <FrontPage />
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        children: [
          { path: "/home", element: <Home /> },
          { path: "/home/transformation", element: <Transformation /> },
          {
            path: "/home/gym/:id",
            element: (
              <AuthAccessGuard>
                <GymPage />
              </AuthAccessGuard>
            ),
          },
          { path: "/home/gym/:id/followersList", element: <FollowersList /> },
          { path: "/home/gym/:id/followingList", element: <FollowingList /> },
          { path: "/home/gym/:id/memberList", element: <MemberList /> },
          { path: "/home/user/:userId", element: <UserProfile /> },
          { path: "/home/gym-dashboard", element: <GymDashboard /> },
          { path: "/home/user-dashboard", element: <UserDashboard /> },
          { path: "/home/profile/edit", element: <EditPersonalDetails /> },
        ],
      },
      {
        path: "/blog",
        element: (
          <ErrorBoundary>
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        children: [
          { path: "/blog", element: <AllBlogs /> },
          { path: "/blog/new", element: <TextEditor /> },
          { path: "/blog/:blogId", element: <BlogPage /> },
          { path: "/blog/myBlogs", element: <MyBlogs /> },
          { path: "/blog/savedblogs", element: <SavedBlogs /> },
          { path: "/blog/likedBlogs", element: <LikedBlogs /> },
        ],
      },
      {
        path: "/listing",
        element: (
          <ErrorBoundary>
            <ProtectedRoute>
              <Listing />
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        children: [
          { path: "/listing", element: <AllListing /> },
          { path: "/listing/new", element: <CreateListingPage /> },
          { path: "/listing/mylisting", element: <MyListing /> },
          { path: "/listing/:listingId", element: <ListingPage /> },
          { path: "/listing/edit/:listingId", element: <EditListingPage /> },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/access-denied",
    element: <UserTypeAccess />,
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
