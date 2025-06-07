import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userBlogDataThunk } from "../store/thunk/blog-management";
import BlogCard from "./blogCard";

const LikedBlogs = () => {
  const dispatch = useDispatch();
  const data = useSelector((store) => store.blog);

  const [likedBlogs, setLikedBlogs] = useState([]);
  const [loading, setLoading] = useState();
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4">
      <h1 className="text-[50px] font-bold text-red-500 mb-10 text-center">
        My Liked Blogs
      </h1>
      <div className="container mx-auto">
        {likedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedBlogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
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

export default LikedBlogs;
