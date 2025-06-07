/* eslint-disable react/prop-types */
import { FaDumbbell, FaTrashAlt, FaCalendarAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteBlogThunk } from "../store/thunk/blog-management";

const BlogCard = ({ blog, blogs, setBlogs }) => {
  const blogId = blog._id;
  const params = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteBlog = async () => {
    dispatch(deleteBlogThunk(blogId));
  };

  const stripHtmlTags = (html) => {
    return html?.replace(/<[^>]+>/g, "");
  };

  return (
    <div className="bg-gray-900 w-[320px] h-[450px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-800 hover:border-orange-500/20 group">
      <div className="h-[45%] relative overflow-hidden">
        {params.pathname.includes("/blog/myBlogs") && (
          <button
            className="p-2 bg-gray-800/90 hover:bg-red-500/90 text-red-400 hover:text-white absolute top-3 right-3 z-10 rounded-full transition-all duration-200 shadow-lg"
            onClick={handleDeleteBlog}
            aria-label="Delete blog"
          >
            <FaTrashAlt className="text-sm" />
          </button>
        )}

        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={
            blog?.coverImage ||
            "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80"
          }
          alt={blog?.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
      </div>

      {/* Blog Content */}
      <div className="p-5 h-[55%] flex flex-col">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-orange-500/10 p-2 rounded-lg">
              <FaDumbbell className="text-orange-500 text-sm" />
            </div>
            <h3 className="text-xl font-bold text-white line-clamp-2">
              {stripHtmlTags(blog?.title)}
            </h3>
          </div>

          <div className="flex items-center text-gray-400 text-sm mb-3">
            <FaCalendarAlt className="mr-2 text-orange-500/80" />
            {new Date(blog?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>

          <p className="text-gray-300 line-clamp-3 text-sm mb-4 leading-relaxed">
            {stripHtmlTags(blog?.content)}
          </p>
        </div>

        <button
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20"
          onClick={() => navigate(`/blog/${blog._id}`)}
        >
          Read More
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
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
