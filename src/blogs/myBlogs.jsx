import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userBlogDataThunk } from "../store/thunk/blog-management";
import BlogCard from "./blogCard";
import { Link } from "react-router-dom";

const MyBlogs = () => {
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const data = useSelector((store) => store.blog);

  useEffect(() => {
    dispatch(userBlogDataThunk());
  }, [dispatch]);

  useEffect(() => {
    if (data.myBlogs) {
      setBlogs(data.myBlogs);
    }
  }, [data.myBlogs]);

  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300 mb-4">
            My Blogs
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your personal fitness journey stories and experiences
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <BlogCard
                key={index}
                blog={blog}
                blogs={blogs}
                setBlogs={setBlogs}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
              <svg
                className="w-16 h-16 text-orange-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                No Blogs Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start sharing your fitness journey with the community!
              </p>
              <Link to="/blog/new">
                <button className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Create First Blog
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
