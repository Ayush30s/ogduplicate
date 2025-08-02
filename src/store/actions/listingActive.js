export const UPDATE_LISTING_REQUEST = "UPDATE_LISTING_REQUEST";
export const UPDATE_LISTING_SUCCESS = "UPDATE_LISTING_SUCCESS";
export const UPDATE_LISTING_FAILURE = "UPDATE_LISTING_FAILURE";
export const FETCH_LISTING_DETAILS_REQUEST = "FETCH_LISTING_DETAILS_REQUEST";
export const FETCH_LISTING_DETAILS_SUCCESS = "FETCH_LISTING_DETAILS_SUCCESS";
export const FETCH_LISTING_DETAILS_FAILURE = "FETCH_LISTING_DETAILS_FAILURE";
export const UPDATE_LISTING_REPORTS = "UPDATE_LISTING_REPORTS";
export const UPDATE_LISTING_LIKES = "UPDATE_LISTING_LIKES";
export const UPDATE_LISTING_SAVES = "UPDATE_LISTING_SAVES";

const fetchListingDetailsRequest = () => ({
  type: FETCH_LISTING_DETAILS_REQUEST,
  payload: null,
});

const fetchListingDetailsSuccess = (data) => ({
  type: FETCH_LISTING_DETAILS_SUCCESS,
  payload: data,
});

const fetchListingDetailsFailure = (error) => ({
  type: FETCH_LISTING_DETAILS_FAILURE,
  payload: error,
});

const updateListingsRequest = () => ({
  type: UPDATE_LISTING_REQUEST,
  payload: null,
});

const updateListingsSuccess = (listing) => ({
  type: UPDATE_LISTING_SUCCESS,
  payload: listing,
});

const updateListingsFailure = (error) => ({
  type: UPDATE_LISTING_FAILURE,
  payload: error,
});

const updateListingLikes = (status) => ({
  type: UPDATE_LISTING_LIKES,
  payload: status,
});

const updateListingSaves = (count) => ({
  type: UPDATE_LISTING_SAVES,
  payload: count,
});

const updateListingReports = (status) => ({
  type: UPDATE_LISTING_REPORTS,
  payload: status,
});

export {
  updateListingLikes,
  updateListingReports,
  updateListingSaves,
  updateListingsFailure,
  updateListingsRequest,
  fetchListingDetailsFailure,
  fetchListingDetailsRequest,
  fetchListingDetailsSuccess,
  updateListingsSuccess,
};
