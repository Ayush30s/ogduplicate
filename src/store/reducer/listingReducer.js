import {
  FETCH_LISTINGS_REQUEST,
  FETCH_LISTINGS_SUCCESS,
  FETCH_LISTINGS_FAILURE,
  ADD_LISTING_REQUEST,
  ADD_LISTING_SUCCESS,
  ADD_LISTING_FAILURE,
  DELETE_LISTING_FAILURE,
  DELETE_LISTING_REQUEST,
  DELETE_LISTING_SUCCESS,
  MY_LISTING_REQUEST,
  MY_LISTING_SUCCESS,
  MY_LISTING_FAILED,
  CLEAR_LISTINGS,
  SET_LISTING_FILTER,
  SET_LISTING_PAGE,
} from "../actions/listing";

export const initialState = {
  listings: [],
  myListing: [],
  loading: null,
  error: null,

  filters: {
    category: null,
    location: null,
    minPrice: 0,
    maxPrice: 100000,
  },

  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 1,
  },

  selectedListing: null,
};

const listingReducer = (state = initialState, action) => {
  switch (action?.type) {
    case FETCH_LISTINGS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_LISTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        listings: action.payload,
      };

    case FETCH_LISTINGS_FAILURE:
      return {
        ...state,
        listings: null,
        loading: false,
        error: action.payload,
      };

    case ADD_LISTING_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ADD_LISTING_SUCCESS:
      return {
        ...state,
        loading: false,
        listings: [...state.listings, action.payload],
        myListing: [...state.myListing, action.payload],
      };

    case ADD_LISTING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action?.payload,
      };

    case DELETE_LISTING_REQUEST:
      return { ...state, loading: true };

    case DELETE_LISTING_SUCCESS:
      return {
        ...state,
        loading: false,
        listings: state.listings.filter((listing) => {
          return listing._id !== action.payload;
        }),
        myListing: state.myListing.filter((listing) => {
          return listing._id !== action.payload;
        }),
      };

    case DELETE_LISTING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case MY_LISTING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case MY_LISTING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        myListing: action.payload,
      };

    case MY_LISTING_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return { ...state, loading: false };
  }
};

export default listingReducer;
