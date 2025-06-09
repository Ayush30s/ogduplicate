import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./index.css";

import App from "./App.jsx";
import Home from "./Home/home.jsx";
import SignIn from "./login/signin.jsx";
import Loading from "./common/loading.jsx";
import Unauthorized from "./errors/unAuth.jsx";
import RegisterPage from "./login/registerPage.jsx";
import RegisterUser from "./login/registerUser.jsx";
import RegisterOwner from "./login/registerOwner.jsx";
import ProtectedRoute from "./Home/protectedRoute.jsx";
import ErrorBoundary from "./common/errorBoundary.jsx";
import AuthAccessGuard from "./guards/authAccessGuard.jsx";

// Lazy-loaded components
const Blogs = lazy(() => import("./blogs/blog.jsx"));
const MyBlogs = lazy(() => import("./blogs/myBlogs.jsx"));
const BlogPage = lazy(() => import("./blogs/blogPage.jsx"));
const AllBlogs = lazy(() => import("./blogs/allBlogs.jsx"));
const GymPage = lazy(() => import("./Home/Gym/gymPage.jsx"));
const FrontPage = lazy(() => import("./Home/frontPage.jsx"));
const TextEditor = lazy(() => import("./blogs/writeBlogs.jsx"));
const SavedBlogs = lazy(() => import("./blogs/savedBlogs.jsx"));
const LikedBlogs = lazy(() => import("./blogs/likedBlogs.jsx"));
const MyListing = lazy(() => import("./listing/myListing.jsx"));
const UserProfile = lazy(() => import("./profile/userProfile.jsx"));
const MemberList = lazy(() => import("./Home/List/memberList.jsx"));
const GymDashboard = lazy(() => import("./profile/gymDashboard.jsx"));
const UserDashboard = lazy(() => import("./profile/userDashboard.jsx"));
const Transformation = lazy(() => import("./Home/Exercise/transformation.jsx"));
const CreateListingPage = lazy(() => import("./listing/postListing.jsx"));
const FollowersList = lazy(() => import("../src/Home/List/followersList.jsx"));
const FollowingList = lazy(() => import("../src/Home/List/followingList.jsx"));
const AboutPage = lazy(() => import("./Home/about.jsx"));
const Listing = lazy(() => import("./listing/listing.jsx"));
const AllListing = lazy(() => import("./listing/allListings.jsx"));
const ListingPage = lazy(() => import("./listing/listingPage.jsx"));
const EditListingPage = lazy(() => import("./listing/editListing.jsx"));
const EditPersonalDetails = lazy(() => import("./profile/editProfile.jsx"));
const UserTypeAccess = lazy(() => import("./errors/userType.jsx"));

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
            <Suspense fallback={<Loading />}>
              <AboutPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/home",
        element: (
          <ErrorBoundary>
            <ProtectedRoute>
              <Suspense fallback={<Loading />}>
                <FrontPage />
              </Suspense>
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        children: [
          { path: "/home", element: <Home /> },
          {
            path: "/home/transformation",
            element: (
              <Suspense fallback={<Loading />}>
                <Transformation />
              </Suspense>
            ),
          },
          {
            path: "/home/gym/:id",
            element: (
              <AuthAccessGuard>
                <Suspense fallback={<Loading />}>
                  <GymPage />
                </Suspense>
              </AuthAccessGuard>
            ),
          },
          {
            path: "/home/gym/:id/followersList",
            element: (
              <Suspense fallback={<Loading />}>
                <FollowersList />
              </Suspense>
            ),
          },
          {
            path: "/home/gym/:id/followingList",
            element: (
              <Suspense fallback={<Loading />}>
                <FollowingList />
              </Suspense>
            ),
          },
          {
            path: "/home/gym/:id/memberList",
            element: (
              <Suspense fallback={<Loading />}>
                <MemberList />
              </Suspense>
            ),
          },
          {
            path: "/home/user/:userId",
            element: (
              <Suspense fallback={<Loading />}>
                <UserProfile />
              </Suspense>
            ),
          },
          {
            path: "/home/gym-dashboard",
            element: (
              <Suspense fallback={<Loading />}>
                <GymDashboard />
              </Suspense>
            ),
          },
          {
            path: "/home/user-dashboard",
            element: (
              <Suspense fallback={<Loading />}>
                <UserDashboard />
              </Suspense>
            ),
          },
          {
            path: "/home/profile/edit",
            element: (
              <Suspense fallback={<Loading />}>
                <EditPersonalDetails />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/blog",
        element: (
          <ErrorBoundary>
            <ProtectedRoute>
              <Suspense fallback={<Loading />}>
                <Blogs />
              </Suspense>
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        children: [
          {
            path: "/blog",
            element: (
              <Suspense fallback={<Loading />}>
                <AllBlogs />
              </Suspense>
            ),
          },
          {
            path: "/blog/new",
            element: (
              <Suspense fallback={<Loading />}>
                <TextEditor />
              </Suspense>
            ),
          },
          {
            path: "/blog/:blogId",
            element: (
              <Suspense fallback={<Loading />}>
                <BlogPage />
              </Suspense>
            ),
          },
          {
            path: "/blog/myBlogs",
            element: (
              <Suspense fallback={<Loading />}>
                <MyBlogs />
              </Suspense>
            ),
          },
          {
            path: "/blog/savedblogs",
            element: (
              <Suspense fallback={<Loading />}>
                <SavedBlogs />
              </Suspense>
            ),
          },
          {
            path: "/blog/likedBlogs",
            element: (
              <Suspense fallback={<Loading />}>
                <LikedBlogs />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/listing",
        element: (
          <ErrorBoundary>
            <ProtectedRoute>
              <Suspense fallback={<Loading />}>
                <Listing />
              </Suspense>
            </ProtectedRoute>
          </ErrorBoundary>
        ),
        children: [
          {
            path: "/listing",
            element: (
              <Suspense fallback={<Loading />}>
                <AllListing />
              </Suspense>
            ),
          },
          {
            path: "/listing/new",
            element: (
              <Suspense fallback={<Loading />}>
                <CreateListingPage />
              </Suspense>
            ),
          },
          {
            path: "/listing/mylisting",
            element: (
              <Suspense fallback={<Loading />}>
                <MyListing />
              </Suspense>
            ),
          },
          {
            path: "/listing/:listingId",
            element: (
              <Suspense fallback={<Loading />}>
                <ListingPage />
              </Suspense>
            ),
          },
          {
            path: "/listing/edit/:listingId",
            element: (
              <Suspense fallback={<Loading />}>
                <EditListingPage />
              </Suspense>
            ),
          },
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
    element: (
      <Suspense fallback={<Loading />}>
        <UserTypeAccess />
      </Suspense>
    ),
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
