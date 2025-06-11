import {
  BlogsListDataRequested,
  BlogsListRequestFailed,
  BlogsListRequestSuccess,
  BlogDataRequested,
  BlogDataRequestFailed,
  BlogDataRequestSuccess,
  BlogPostFailed,
  BlogPostRequest,
  BlogPostSuccess,
  BlogDeleteSucess,
  BlogDeleteFailed,
} from "../actions/blog";

const allBlogsThunk = (navigate) => async (dispatch) => {
  dispatch(BlogsListDataRequested());

  try {
    const response = await fetch(
      "https://gymbackenddddd-1.onrender.com/blog/allblogs",
      {
        method: "GET",
        credentials: "include",
      }
    );

    // Handle 401 Unauthorized
    if (response.status === 401) {
      navigate("/?error=signin to use this webiste");
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    // Success: Process the data
    const data = await response.json();
    console.log("response", data);

    dispatch(BlogsListRequestSuccess(data));
  } catch (err) {
    // Handle specific error for unauthorized access
    if (err.message === "Unauthorized access!") {
      dispatch(BlogsListRequestFailed(err));
    }
  }
};

const userBlogDataThunk = () => async (dispatch) => {
  dispatch(BlogDataRequested());
  try {
    const response = await fetch(
      "https://gymbackenddddd-1.onrender.com/blog/allblogsData",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("FAILED_TO_FETCH_LIKED_BLOGS");
    } else {
      const result = await response.json();
      console.log(result, "result");
      dispatch(BlogDataRequestSuccess(result));
    }
  } catch (error) {
    console.error("Error saving blog:", error);
    dispatch(BlogDataRequestFailed(error));
  }
};

// const myBlogsThunk = async (dispatch) => {
//   dispatch(BlogDataRequested());
//   try {
//     const response = await fetch("https://gymbackenddddd-1.onrender.com/blog/myBlogs", {
//       method: "GET",
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error("FAILED_TO_FETCH_MY_BLOGS");
//     } else {
//       const myBlogs = await response.json();
//       console.log("result", myBlogs);
//       dispatch(BlogDataRequestSuccess(myBlogs));
//     }
//   } catch (err) {
//     console.error("Error fetching blogs:", err);
//     dispatch(BlogDataRequestFailed(err));
//   }
// };

const postBlogThunk = (payload, navigate) => async (dispatch) => {
  dispatch(BlogPostRequest());
  console.log("payload", payload);
  try {
    const response = await fetch(
      "https://gymbackenddddd-1.onrender.com/blog/new",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(response.error);
    } else {
      const result = await response.json();
      console.log(result);
      dispatch(BlogPostSuccess(result));
      navigate(`/blog/${result.blog?._id}`);
    }
  } catch (error) {
    console.error("Error :", error);
    dispatch(BlogPostFailed(error));
  }
};

const deleteBlogThunk = (blogId) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://gymbackenddddd-1.onrender.com/blog/${blogId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const result = await response.json();
    console.log(result, "result");
    if (!response.ok) {
      throw new Error(response);
    }

    dispatch(BlogDeleteSucess(blogId));
  } catch (err) {
    console.log(err);
    dispatch(BlogDeleteFailed(err));
  }
};

export { allBlogsThunk, userBlogDataThunk, postBlogThunk, deleteBlogThunk };
