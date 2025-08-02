export const FETCH_LISTINGS_REQUEST = "FETCH_LISTINGS_REQUEST";
export const FETCH_LISTINGS_SUCCESS = "FETCH_LISTINGS_SUCCESS";
export const FETCH_LISTINGS_FAILURE = "FETCH_LISTINGS_FAILURE";
export const ADD_LISTING_REQUEST = "ADD_LISTING_REQUEST";
export const ADD_LISTING_SUCCESS = "ADD_LISTING_SUCCESS";
export const ADD_LISTING_FAILURE = "ADD_LISTING_FAILURE";
export const SET_LISTING_FILTER = "SET_LISTING_FILTER";
export const SET_LISTING_PAGE = "SET_LISTING_PAGE";
export const CLEAR_LISTINGS = "CLEAR_LISTINGS";
export const DELETE_LISTING_REQUEST = "DELETE_LISTING_REQUEST";
export const DELETE_LISTING_SUCCESS = "DELETE_LISTING_SUCCESS";
export const DELETE_LISTING_FAILURE = "DELETE_LISTING_FAILURE";
export const MY_LISTING_REQUEST = "MY_LISTING_REQUEST";
export const MY_LISTING_SUCCESS = "MY_LISTING_SUCCESS";
export const MY_LISTING_FAILED = "MY_LISTING_FAILED";

const fetchAllListingsRequest = () => ({
  type: FETCH_LISTINGS_REQUEST,
  payload: null,
});

const fetchAllListingsSuccess = (listings) => ({
  type: FETCH_LISTINGS_SUCCESS,
  payload: listings,
});

const fetchAllListingsFailure = (error) => ({
  type: FETCH_LISTINGS_FAILURE,
  payload: error,
});

const addListingsRequest = () => ({
  type: ADD_LISTING_REQUEST,
  payload: null,
});

const addListingsSuccess = (listingId) => ({
  type: ADD_LISTING_SUCCESS,
  payload: listingId,
});

const addListingsFailure = (error) => ({
  type: ADD_LISTING_FAILURE,
  payload: error,
});

const clearListings = () => ({
  type: CLEAR_LISTINGS,
  payload: null,
});

const setListingsFilters = (filters) => ({
  type: SET_LISTING_FILTER,
  payload: filters,
});

const setListingsPage = () => ({
  type: SET_LISTING_PAGE,
  payload: null,
});

const deleteListingsRequest = () => ({
  type: DELETE_LISTING_REQUEST,
  payload: null,
});

const deleteListingsSuccess = (listingId) => ({
  type: DELETE_LISTING_SUCCESS,
  payload: listingId,
});

const deleteListingsFailure = (error) => ({
  type: DELETE_LISTING_FAILURE,
  payload: error,
});

const fetchMyListingRequest = () => ({
  type: MY_LISTING_REQUEST,
  payload: null,
});

const fetchMyListingSuccess = (data) => ({
  type: MY_LISTING_SUCCESS,
  payload: data,
});

const fetchMyListingFailed = (error) => ({
  type: MY_LISTING_FAILED,
  payload: error,
});

export {
  fetchAllListingsRequest,
  fetchAllListingsSuccess,
  fetchAllListingsFailure,
  addListingsRequest,
  addListingsSuccess,
  addListingsFailure,
  clearListings,
  setListingsFilters,
  setListingsPage,
  fetchMyListingRequest,
  fetchMyListingSuccess,
  fetchMyListingFailed,
  deleteListingsRequest,
  deleteListingsSuccess,
  deleteListingsFailure,
};
