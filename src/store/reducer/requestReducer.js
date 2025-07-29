import {
  REQUEST_ACTION_FAILED,
  REQUEST_ACTION_SUCCESS,
  FETCH_ALL_REQUEST_SUCCESS,
  UPDATE_STATUS_FAILED,
  UPDATE_STATUS_SUCCESS,
  DELETE_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION_FAILED,
} from "../actions/request";

export const initialState = {
  requsetArray: [],
  loading: false,
  error: null,
};

const requestReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ACTION_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case REQUEST_ACTION_SUCCESS:
      console.log(action.payload, "one request");
      return {
        ...state,
        loading: false,
        requsetArray: [...state.requsetArray, action.payload],
      };

    case FETCH_ALL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        requsetArray: action.payload,
      };

    case UPDATE_STATUS_FAILED:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        requsetArray: state.requsetArray.map((req) =>
          req._id === action.payload.requestId
            ? { ...req, status: action.payload.status }
            : req
        ),
        loading: false,
        error: null,
      };

    case DELETE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        requsetArray: state.requsetArray.filter((req) => {
          req._id != action.payload;
        }),
      };

    case DELETE_NOTIFICATION_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default requestReducer;
