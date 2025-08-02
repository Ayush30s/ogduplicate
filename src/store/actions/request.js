export const REQUEST_ACTION_SUCCESS = "REQUEST_ACTION_SUCCESS";
export const REQUEST_ACTION_FAILED = "REQUEST_ACTION_FAILED";
export const FETCH_ALL_REQUEST_SUCCESS = "FETCH_ALL_REQUEST_SUCCESS";
export const UPDATE_STATUS_SUCCESS = "UPDATE_STATUS_SUCCESS";
export const UPDATE_STATUS_FAILED = "UPDATE_STATUS_FAILED";
export const DELETE_NOTIFICATION_SUCCESS = "DELETE_NOTIFICATION_SUCCESS";
export const DELETE_NOTIFICATION_FAILED = "DELETE_NOTIFICATION_FAILED";

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

const deletNotificationFailed = (error) => ({
  type: DELETE_NOTIFICATION_FAILED,
  payload: error,
});

export {
  requestActionFailed,
  requestActionSuccess,
  fetchAllRequestSuccess,
  updateStatusSuccess,
  updateStatusFailed,
  deletNotificationSuccess,
  deletNotificationFailed,
};
