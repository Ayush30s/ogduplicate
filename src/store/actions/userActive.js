export const USERDATA_REQUEST_PENDING = "USERDATA_REQUEST_PENDING";
export const USERDATA_REQUEST_SUCCESS = "USERDATA_REQUEST_SUCCESS";
export const USERDATA_REQUEST_FAILED = "USERDATA_REQUEST_FAILED";
export const USERPAGE_FOLLOW_REQUEST_PENDING =
  "USERPAGE_FOLLOW_REQUEST_PENDING";
export const USERPAGE_FOLLOW_REQUEST_SUCCESS =
  "USERPAGE_FOLLOW_REQUEST_SUCCESS";
export const USERPAGE_FOLLOW_REQUEST_FAILED = "USERPAGE_FOLLOW_REQUEST_FAILED";

const userDataRequestPending = () => ({
  type: USERDATA_REQUEST_PENDING,
  payload: null,
});

const userDataRequestSuccess = (userData) => ({
  type: USERDATA_REQUEST_SUCCESS,
  payload: userData,
});

const userDataRequestFailure = (error) => ({
  type: USERDATA_REQUEST_FAILED,
  payload: error,
});

const userPageFollowRequestPending = () => ({
  type: USERPAGE_FOLLOW_REQUEST_PENDING,
  payload: null,
});

const userPageFollowRequestFailed = () => ({
  type: USERPAGE_FOLLOW_REQUEST_FAILED,
  payload: null,
});

const userPageFollowRequestSuccess = (followResult) => ({
  type: USERPAGE_FOLLOW_REQUEST_SUCCESS,
  payload: followResult,
});

export {
  userDataRequestPending,
  userDataRequestFailure,
  userDataRequestSuccess,
  userPageFollowRequestPending,
  userPageFollowRequestFailed,
  userPageFollowRequestSuccess,
};
