import {
  BLOGS_LIST_REQUEST,
  BLOGS_LIST_REQUEST_FAILED,
  BLOGS_LIST_REQUEST_SUCCESS,
  BLOG_DATA_REQUEST,
  BLOG_DATA_REQUEST_FAILED,
  BLOG_DATA_REQUEST_SUCCESS,
  BLOG_POST_FAILED,
  BLOG_POST_REQUEST,
  BLOG_POST_SUCCESS,
  BLOG_DELETE_REQUEST_FAILED,
  BLOG_DELETE_REQUEST_SUCCESS,
} from "../actions/blog";

export const initialState = {
  allblogs: [],
  blogsData: [],
  myBlogs: [],
  loading: false,
  error: null,
};

const blogReducer = (state = initialState, action) => {
  switch (action?.type) {
    case BLOGS_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BLOGS_LIST_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case BLOGS_LIST_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        allblogs: action.payload.data,
        error: null,
      };

    case BLOG_DATA_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case BLOG_DATA_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case BLOG_DATA_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        blogsData: action.payload.blogsData,
        myBlogs: action.payload.myBlogs,
        error: null,
      };

    case BLOG_POST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case BLOG_POST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case BLOG_POST_SUCCESS:
      return {
        ...state,
        allblogs: [...state.allblogs, action.payload],
        loading: false,
      };

    case BLOG_DELETE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        allblogs: state?.allblogs?.filter((blog) => {
          return blog._id !== action.payload;
        }),
        myBlogs: state.myBlogs.filter((blog) => {
          return blog._id !== action.payload;
        }),
      };

    case BLOG_DELETE_REQUEST_FAILED:
      console.log(action.payload, "error in blog delete");
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default blogReducer;
