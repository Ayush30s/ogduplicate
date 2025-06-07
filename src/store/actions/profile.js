export const FETCH_PROFILE_DATA = "FETCH_PROFILE_DATA";
export const FETCH_PROFILE_DATA_SUCCESS = "FETCH_PROFILE_DATA_SUCCESS";
export const FETCH_PROFILE_DATA_FAILED = "FETCH_PROFILE_DATA_FAILED";
export const SET_PERSONAL_PROFILE_DATA = "SET_PERSONAL_PROFILE_DATA";
export const SET_PERSONAL_PROFILE_DATA_REQUEST =
  "SET_PERSONAL_PROFILE_DATA_REQUEST";
export const CREATE_NEW_SHIFT_REQUEST = "CREATE_NEW_SHIFT";
export const CREATE_NEW_SHIFT_SUCCESS = "CREATE_NEW_SHIFT_SUCCESS";
export const CREATE_NEW_SHIFT_FAILED = "CREATE_NEW_SHIFT_FAILED";
export const DELETE_SHIFT_SUCCESS = "DELETE_SHIFT_SUCCESS";
export const DELETE_SHIFT_FAILED = "DELETE_SHIFT_FAILED";
export const UPDATE_SHIFT_SUCCESS = "UPDATE_SHIFT_SUCCESS";
export const UPDATE_SHIFT_FAILED = "UPDATE_SHIFT_FAILED";

const requestProfileData = () => ({
  type: FETCH_PROFILE_DATA,
  payload: {},
});

const setProfileDataSuccess = (data) => ({
  type: FETCH_PROFILE_DATA_SUCCESS,
  payload: data,
});

const setProfileDataFailed = (error) => ({
  type: FETCH_PROFILE_DATA_FAILED,
  payload: error,
});

const setPersonalProfileData = (data) => ({
  type: SET_PERSONAL_PROFILE_DATA,
  payload: data,
});

const setPersonalProfileDataReq = () => ({
  type: SET_PERSONAL_PROFILE_DATA_REQUEST,
  payload: {},
});

const setNewShiftRequest = () => ({
  type: CREATE_NEW_SHIFT_REQUEST,
  payload: {},
});

const setNewShiftSuccess = (data) => ({
  type: CREATE_NEW_SHIFT_SUCCESS,
  payload: data,
});

const setNewShiftFail = () => ({
  type: CREATE_NEW_SHIFT_FAILED,
  payload: {},
});

const setShiftDeleteSuccess = (shiftId) => ({
  type: DELETE_SHIFT_SUCCESS,
  payload: shiftId,
});

const setShiftDeleteFail = (error) => ({
  type: DELETE_SHIFT_FAILED,
  payload: error,
});

const setUpdateShiftSuccess = (data) => ({
  type: UPDATE_SHIFT_SUCCESS,
  payload: data,
});

const setUpdateShiftFail = (error) => ({
  type: UPDATE_SHIFT_FAILED,
  payload: error,
});

export {
  requestProfileData,
  setProfileDataSuccess,
  setProfileDataFailed,
  setPersonalProfileData,
  setPersonalProfileDataReq,
  setNewShiftRequest,
  setNewShiftSuccess,
  setNewShiftFail,
  setShiftDeleteSuccess,
  setShiftDeleteFail,
  setUpdateShiftSuccess,
  setUpdateShiftFail,
};
