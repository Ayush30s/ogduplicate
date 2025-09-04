import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userBlogDataThunk } from "../store/thunk/blog-management";
import BlogCard from "./blogCard";
import { Link } from "react-router-dom";

const LikedBlogs = () => {
  const dispatch = useDispatch();
  const data = useSelector((store) => store.blog);

  const [likedBlogs, setLikedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(userBlogDataThunk());
  }, [dispatch]);

  useEffect(() => {
    if (data?.blogsData?.likedblogs) {
      setLikedBlogs(data.blogsData?.likedblogs);
    }
    setLoading(data.loading);
    setError(data.error);
  }, [data?.blogsData?.likedblogs, data.error, data.loading]);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your liked blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 text-center">
          <svg
            className="w-16 h-16 text-pink-500 mx-auto mb-4"
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
            className="bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 mb-4">
            My Liked Blogs
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            The fitness stories that inspired and motivated you
          </p>
        </div>

        {/* Blog Grid */}
        {likedBlogs.length > 0 ? (
          <div className="flex flex-wrap gap-8 align-middle justify-center">
            {likedBlogs.map((blog, index) => (
              <div key={index}>
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
              <svg
                className="w-16 h-16 text-pink-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                No Liked Blogs Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Like blogs that inspire your fitness journey and they'll appear
                here!
              </p>
              <Link to="/blog">
                <button className="bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Explore Blogs
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedBlogs;
