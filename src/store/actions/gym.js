export const FETCH_ALL_GYM_DATA_REQUEST = "FETCH_ALL_GYM_DATA_REQUEST";
export const FETCH_ALL_GYM_DATA_FAILED = "FETCH_ALL_GYM_DATA_FAILED";
export const FETCH_ALL_GYM_DATA_SUCCESSFUL = "FETCH_ALL_GYM_DATA_SUCCESSFUL";

const fetchAllGymRequest = () => ({
  type: FETCH_ALL_GYM_DATA_REQUEST,
  payload: {},
});

const fetchAllGymRequestSuccess = (gyms) => ({
  type: FETCH_ALL_GYM_DATA_SUCCESSFUL,
  payload: gyms,
});

const fetchAllGymRequestFail = () => ({
  type: FETCH_ALL_GYM_DATA_FAILED,
  payload: {},
});

export {
  fetchAllGymRequest,
  fetchAllGymRequestFail,
  fetchAllGymRequestSuccess,
};
