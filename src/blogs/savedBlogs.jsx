import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userBlogDataThunk } from "../store/thunk/blog-management";
import BlogCard from "./blogCard";
import Loading from "../common/loading";

const SavedBlogs = () => {
  const dispatch = useDispatch();
  const data = useSelector((store) => store.blog);

  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(userBlogDataThunk());
  }, [dispatch]);

  useEffect(() => {
    if (data.blogsData?.savedblogs) {
      setSavedBlogs(data.blogsData?.savedblogs);
    }
    setLoading(data.loading);
    setError(data.error);
  }, [data?.blogsData?.savedblogs, data.error, data.loading]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-2xl font-bold text-gray-200 mb-2">
            Error Occurred
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-300 mb-4">
            My Saved Blogs
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your collection of inspiring fitness stories and experiences
          </p>
        </div>

        {/* Blog Grid */}
        {savedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedBlogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                No Saved Blogs Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start exploring and save blogs that inspire your fitness
                journey!
              </p>
              <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                Explore Blogs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBlogs;
