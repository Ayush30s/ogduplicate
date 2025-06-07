export const LOGIN_SUCCESSFULL = "LOGIN_SUCCESSFULL";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_USER = "LOGOUT_USER";

const setLoginData = (profileData) => ({
  type: LOGIN_SUCCESSFULL,
  payload: profileData,
});

const setLoginRequest = () => ({
  type: LOGIN_REQUEST,
  payload: {},
});

const setLoginFailed = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

const setLogoutUser = () => ({
  type: LOGOUT_USER,
  payload: {},
});

export { setLoginData, setLoginRequest, setLoginFailed, setLogoutUser };
