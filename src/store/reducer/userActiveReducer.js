import {
  USERDATA_REQUEST_PENDING,
  USERDATA_REQUEST_FAILED,
  USERDATA_REQUEST_SUCCESS,
  USERPAGE_FOLLOW_REQUEST_FAILED,
  USERPAGE_FOLLOW_REQUEST_PENDING,
  USERPAGE_FOLLOW_REQUEST_SUCCESS,
} from "../actions/userActive";

export const initialState = {
  userData: [],
  showEditPage: false,
  followersCount: 0,
  followingCount: 0,
  loggedInUserFollowMe: false,
  userFollowLoggedInUser: false,
  exerciseArray: [],
  musclesNameArray: [],
  muscleCountArray: [],
  exerciseNameArray: [],
  exerciseCountArray: [],
  totalexerciseDone: 0,
  totalMuscleTrained: 0,
  FollowRequestStatus: -1,
  followRequestLoading: false,
  loading: false,
  error: null,
};

const activeUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERDATA_REQUEST_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case USERDATA_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case USERDATA_REQUEST_SUCCESS: {
      const {
        userData,
        showEditPage,
        followersCount,
        followingCount,
        loggedInUserFollowMe,
        userFollowLoggedInUser,
        exerciseArray,
        musclesNameArray,
        muscleCountArray,
        exerciseNameArray,
        exerciseCountArray,
        totalexerciseDone,
        totalMuscleTrained,
        FollowRequestStatus,
      } = action.payload;

      return {
        ...state,
        userData: userData,
        showEditPage: showEditPage,
        followersCount: followersCount,
        followingCount: followingCount,
        loggedInUserFollowMe: loggedInUserFollowMe,
        userFollowLoggedInUser: userFollowLoggedInUser,
        exerciseArray: exerciseArray,
        musclesNameArray: musclesNameArray,
        muscleCountArray: muscleCountArray,
        exerciseNameArray: exerciseNameArray,
        exerciseCountArray: exerciseCountArray,
        totalexerciseDone: totalexerciseDone,
        totalMuscleTrained: totalMuscleTrained,
        FollowRequestStatus: FollowRequestStatus,
        followRequestLoading: false,
        loading: false,
        error: null,
      };
    }

    case USERPAGE_FOLLOW_REQUEST_PENDING:
      return {
        ...state,
        followRequestLoading: true,
      };

    case USERPAGE_FOLLOW_REQUEST_FAILED:
      return {
        ...state,
        followRequestLoading: false,
        error: action.payload,
      };

    case USERPAGE_FOLLOW_REQUEST_SUCCESS:
      return {
        ...state,
        followRequestLoading: false,
        followersCount:
          action.payload === "UNFOLLOW_SUCCESSFUL"
            ? state.followersCount - 1
            : state.followersCount + 1,
        loggedInUserFollowMe: !state.loggedInUserFollowMe,
      };

    default:
      return state;
  }
};

export default activeUserReducer;
