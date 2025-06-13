import {
  UPDATE_LISTING_FAILURE,
  UPDATE_LISTING_REQUEST,
  UPDATE_LISTING_SUCCESS,
  FETCH_LISTING_DETAILS_REQUEST,
  FETCH_LISTING_DETAILS_SUCCESS,
  FETCH_LISTING_DETAILS_FAILURE,
  UPDATE_LISTING_LIKES,
  UPDATE_LISTING_REPORTS,
  UPDATE_LISTING_SAVES,
} from "../actions/listingActive";

export const initialState = {
  isLoggedInUser: false,
  listingData: null,
  likeStatus: false,
  saveStatus: false,
  flagStatus: false,
  likeCount: 0,
  saveCount: 0,
  flagCount: 0,
  loading: null,
  error: null,
};

const listingReducerActive = (state = initialState, action) => {
  switch (action?.type) {
    case FETCH_LISTING_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_LISTING_DETAILS_SUCCESS:
      return {
        ...state,
        isLoggedInUser: action.payload.isLoggedInUser,
        listingData: action.payload.listingData,
        likeCount: action.payload.likeCount,
        saveCount: action.payload.saveCount,
        flagCount: action.payload.flagCount,
        likeStatus: action.payload.likeStatus,
        saveStatus: action.payload.saveStatus,
        flagStatus: action.payload.flagStatus,
        loading: false,
        error: null,
      };

    case FETCH_LISTING_DETAILS_FAILURE:
      return {
        ...state,
        listingData: null,
        loading: false,
        error: action.payload,
      };

    case UPDATE_LISTING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_LISTING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        listingData: action.payload,
      };

    case UPDATE_LISTING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_LISTING_LIKES:
      return {
        ...state,
        likeCount: action.payload
          ? state.likeCount + 1
          : state.likeCount > 0
          ? state.likeCount - 1
          : 0,
        likeStatus: action.payload,
      };

    case UPDATE_LISTING_SAVES:
      return {
        ...state,
        saveCount: action.payload.saves,
        saveStatus: action.payload.isSaved,
      };

    case UPDATE_LISTING_REPORTS:
      return {
        ...state,
        flagCount: action.payload
          ? state.flagCount + 1
          : state.flagCount > 0
          ? state.flagCount - 1
          : 0,
        flagStatus: action.payload,
      };

    default:
      return { ...state, loading: false };
  }
};

export default listingReducerActive;
