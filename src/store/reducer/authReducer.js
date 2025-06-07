import {
  LOGIN_SUCCESSFULL,
  LOGIN_REQUEST,
  LOGOUT_USER,
  LOGIN_FAILURE,
} from "../actions/auth";

export const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LOGIN_SUCCESSFULL: {
      console.log(action.payload)
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    }
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        loding: false,
        error: false,
      };

    default:
      return state;
  }
};

export default authReducer;
