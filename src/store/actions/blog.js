export const BLOGS_LIST_REQUEST = "BLOGS_LIST_REQUEST";
export const BLOGS_LIST_REQUEST_SUCCESS = "BLOGS_LIST_REQUEST_SUCCESS";
export const BLOGS_LIST_REQUEST_FAILED = "BLOGS_LIST_REQUEST_FAILED";
export const BLOG_DATA_REQUEST = "BLOG_DATA_REQUEST";
export const BLOG_DATA_REQUEST_FAILED = "BLOG_DATA_REQUEST_FAILED";
export const BLOG_DATA_REQUEST_SUCCESS = "BLOG_DATA_REQUEST_SUCCESS";
export const BLOG_POST_REQUEST = "BLOG_POST_REQUEST";
export const BLOG_POST_SUCCESS = "BLOG_POST_SUCCESS";
export const BLOG_POST_FAILED = "BLOG_POST_FAILED";
export const BLOG_DELETE_REQUEST_SUCCESS = "BLOG_DELETE_REQUEST_SUCCESS";
export const BLOG_DELETE_REQUEST_FAILED = "BLOG_DELETE_REQUEST_FAILED";

const BlogsListDataRequested = () => ({
  type: BLOGS_LIST_REQUEST,
  payload: {},
});

const BlogsListRequestFailed = () => ({
  type: BLOGS_LIST_REQUEST_FAILED,
  payload: {},
});

const BlogsListRequestSuccess = (blogData) => ({
  type: BLOGS_LIST_REQUEST_SUCCESS,
  payload: blogData,
});

const BlogDataRequested = () => ({
  type: BLOG_DATA_REQUEST,
  payload: {},
});

const BlogDataRequestFailed = () => ({
  type: BLOG_DATA_REQUEST_FAILED,
  payload: {},
});

const BlogDataRequestSuccess = (BlogData) => ({
  type: BLOG_DATA_REQUEST_SUCCESS,
  payload: BlogData,
});

const BlogPostRequest = (BlogData) => ({
  type: BLOG_POST_REQUEST,
  payload: BlogData,
});

const BlogPostSuccess = (BlogData) => ({
  type: BLOG_POST_SUCCESS,
  payload: BlogData,
});

const BlogPostFailed = () => ({
  type: BLOG_POST_FAILED,
  payload: {},
});

const BlogDeleteSucess = (blogId) => ({
  type: BLOG_DELETE_REQUEST_SUCCESS,
  payload: blogId,
});

const BlogDeleteFailed = () => ({
  type: BLOG_DELETE_REQUEST_FAILED,
  payload: {},
});

export {
  BlogPostFailed,
  BlogPostSuccess,
  BlogPostRequest,
  BlogDeleteSucess,
  BlogDeleteFailed,
  BlogDataRequested,
  BlogDataRequestFailed,
  BlogDataRequestSuccess,
  BlogsListDataRequested,
  BlogsListRequestFailed,
  BlogsListRequestSuccess,
};
