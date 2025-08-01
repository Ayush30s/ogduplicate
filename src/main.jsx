import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./index.css";

// Not lazy loaded
import GymPage from "./Home/Gym/gymPage.jsx";
import Loading from "./common/loading.jsx";
import UserTypeAccessGuard from "./guards/userTypeAccessGuard.jsx";
import GymDashboard from "./profile/gymDashboard.jsx";
import UserDashboard from "./profile/userDashboard.jsx";
import ProtectedRoute from "./guards/protectedRoute.jsx";
import WorkoutPlanForm from "./Home/Exercise/transformation.jsx";
import SignIn from "./login/signin.jsx";
import AboutPage from "./Home/about.jsx";
import Home from "./Home/home.jsx";
import FrontPage from "./Home/frontPage.jsx";

const App = lazy(() => import("./App.jsx"));
const Blogs = lazy(() => import("./blogs/blog.jsx"));
const MyBlogs = lazy(() => import("./blogs/myBlogs.jsx"));
const BlogPage = lazy(() => import("./blogs/blogPage.jsx"));
const AllBlogs = lazy(() => import("./blogs/allBlogs.jsx"));
const TextEditor = lazy(() => import("./blogs/writeBlogs.jsx"));
const SavedBlogs = lazy(() => import("./blogs/savedBlogs.jsx"));
const LikedBlogs = lazy(() => import("./blogs/likedBlogs.jsx"));
const MyListing = lazy(() => import("./listing/myListing.jsx"));
const Unauthorized = lazy(() => import("./errors/unAuth.jsx"));
const RegisterPage = lazy(() => import("./login/registerPage.jsx"));
const RegisterUser = lazy(() => import("./login/registerUser.jsx"));
const UserProfile = lazy(() => import("./profile/userProfile.jsx"));
const MemberList = lazy(() => import("./Home/List/memberList.jsx"));
const RegisterOwner = lazy(() => import("./login/registerOwner.jsx"));
const CreateListingPage = lazy(() => import("./listing/postListing.jsx"));
const FollowersList = lazy(() => import("../src/Home/List/followersList.jsx"));
const FollowingList = lazy(() => import("../src/Home/List/followingList.jsx"));
const Listing = lazy(() => import("./listing/listing.jsx"));
const AllListing = lazy(() => import("./listing/allListings.jsx"));
const ListingPage = lazy(() => import("./listing/listingPage.jsx"));
const EditListingPage = lazy(() => import("./listing/editListing.jsx"));
const ErrorBoundary = lazy(() => import("./common/errorBoundary.jsx"));
const EditPersonalDetails = lazy(() => import("./profile/editProfile.jsx"));
const UserTypeAccess = lazy(() => import("./errors/userType.jsx"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    ),
    children: [
      // Unprotected Routes
      {
        path: "/",
        element: <SignIn />,
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "/register/user",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterUser />
          </Suspense>
        ),
      },
      {
        path: "/register/owner",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterOwner />
          </Suspense>
        ),
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/home",
        element: (
          <ErrorBoundary>
            <FrontPage />
          </ErrorBoundary>
        ),
        children: [
          {
            path: "/home",
            element: <Home />,
          },
          {
            path: "/home/transformation",
            element: (
              <Suspense fallback={<Loading message="Workout Planing..." />}>
                <UserTypeAccessGuard>
                  <WorkoutPlanForm />
                </UserTypeAccessGuard>
              </Suspense>
            ),
          },
          { path: "/home/gym/:id", element: <GymPage /> },
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
                <UserTypeAccessGuard>
                  <ProtectedRoute>
                    <GymDashboard />
                  </ProtectedRoute>
                </UserTypeAccessGuard>
              </Suspense>
            ),
          },
          {
            path: "/home/user-dashboard",
            element: (
              <Suspense fallback={<Loading />}>
                <UserTypeAccessGuard>
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                </UserTypeAccessGuard>
              </Suspense>
            ),
          },
          {
            path: "/home/profile/edit",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <EditPersonalDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/blog",
        element: (
          <Suspense fallback={<Loading />}>
            <ErrorBoundary>
              <Blogs />
            </ErrorBoundary>
          </Suspense>
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
                <ProtectedRoute>
                  <TextEditor />
                </ProtectedRoute>
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
                <ProtectedRoute>
                  <MyBlogs />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/blog/savedblogs",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <SavedBlogs />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/blog/likedBlogs",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <LikedBlogs />
                </ProtectedRoute>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/listing",
        element: (
          <Suspense fallback={<Loading />}>
            <ErrorBoundary>
              <Listing />
            </ErrorBoundary>
          </Suspense>
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
                <ProtectedRoute>
                  <CreateListingPage />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/listing/mylisting",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <MyListing />
                </ProtectedRoute>
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
                <ProtectedRoute>
                  <EditListingPage />
                </ProtectedRoute>
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<Loading />}>
        <Unauthorized />
      </Suspense>
    ),
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
root.render(
  <Suspense fallback={<Loading />}>
    <RouterProvider router={appRouter} />
  </Suspense>
);
