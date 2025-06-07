import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userBlogDataThunk } from "../store/thunk/blog-management";
import BlogCard from "./blogCard";

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
    <div className="bg-gray-900 min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-orange-500 mb-12 text-center">
          My Blogs
        </h1>
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
          <div className="text-center text-white">
            <p className="text-2xl font-semibold">
              No blogs yet. Be the first to share your fitness journey!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
