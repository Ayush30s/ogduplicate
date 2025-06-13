export const REQUEST_ACTION_PENDING = "REQUEST_ACTION_PENDING";
export const REQUEST_ACTION_SUCCESS = "REQUEST_ACTION_SUCCESS";
export const REQUEST_ACTION_FAILED = "REQUEST_ACTION_FAILED";
export const FETCH_ALL_REQUEST_SUCCESS = "FETCH_ALL_REQUEST_SUCCESS";
export const UPDATE_STATUS_REQUEST = "UPDATE_STATUS_REQUEST";
export const UPDATE_STATUS_SUCCESS = "UPDATE_STATUS_SUCCESS";
export const UPDATE_STATUS_FAILED = "UPDATE_STATUS_FAILED";
export const DELETE_NOTIFICATION_SUCCESS = "DELETE_NOTIFICATION_SUCCESS";

const requestActionPending = () => ({
  type: REQUEST_ACTION_PENDING,
  payload: null,
});

const requestActionSuccess = (data) => ({
  type: REQUEST_ACTION_SUCCESS,
  payload: data,
});

const requestActionFailed = (error) => ({
  type: REQUEST_ACTION_FAILED,
  payload: error,
});

const fetchAllRequestSuccess = (data) => ({
  type: FETCH_ALL_REQUEST_SUCCESS,
  payload: data,
});

const updateStatusRequest = () => ({
  type: UPDATE_STATUS_REQUEST,
  payload: null,
});

const updateStatusSuccess = (data) => ({
  type: UPDATE_STATUS_SUCCESS,
  payload: data,
});

const updateStatusFailed = (error) => ({
  type: UPDATE_STATUS_FAILED,
  payload: error,
});

const deletNotificationSuccess = (notificationId) => ({
  type: DELETE_NOTIFICATION_SUCCESS,
  payload: notificationId,
});

export {
  requestActionFailed,
  requestActionPending,
  requestActionSuccess,
  fetchAllRequestSuccess,
  updateStatusRequest,
  updateStatusSuccess,
  updateStatusFailed,
  deletNotificationSuccess,
};
