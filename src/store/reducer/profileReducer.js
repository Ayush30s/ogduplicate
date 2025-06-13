import {
  FETCH_PROFILE_DATA,
  FETCH_PROFILE_DATA_FAILED,
  FETCH_PROFILE_DATA_SUCCESS,
  SET_PERSONAL_PROFILE_DATA,
  SET_PERSONAL_PROFILE_DATA_REQUEST,
  CREATE_NEW_SHIFT_REQUEST,
  CREATE_NEW_SHIFT_SUCCESS,
  CREATE_NEW_SHIFT_FAILED,
  DELETE_SHIFT_FAILED,
  DELETE_SHIFT_SUCCESS,
  UPDATE_SHIFT_SUCCESS,
  UPDATE_SHIFT_FAILED,
} from "../actions/profile";

export const initialState = {
  loading: false,
  error: null,
  bio: "",
  email: "",
  gender: "",
  location: "",
  fullName: "",
  userType: "",
  description: "",
  createdAt: "",
  monthlyCharge: "",
  contactNumber: "",
  profileImage: "",
  showFollowButton: "",
  showJoinedGym: "",
  showEditPage: false,
  allShifts: [],
  analytics: [],
  joinedGym: [],
  joinedBy: [],
  muscleCount: [],
  exerciseCount: [],
  muscleFreq: [],
  exerciseFreq: [],
  followersList: [],
  followingList: [],
  HeatMap: [],
  activeMonths: [],
  userToshiftMap: null,
};

const profileReducer = (state = initialState, action) => {
  switch (action?.type) {
    case FETCH_PROFILE_DATA:
      return {
        ...state,
        error: null,
        loading: true,
      };

    case FETCH_PROFILE_DATA_SUCCESS: {
      console.log(action.payload);
      const {
        bio,
        email,
        gender,
        street,
        city,
        state,
        fullName,
        userType,
        description,
        createdAt,
        monthlyCharge,
        contactNumber,
        profileImage,
        joinedGym,
        joinedBy,
      } = action.payload.data;

      const {
        showFollowButton,
        showjoinedgym,
        allShifts,
        activeMonths,
        followingList,
        followersList,
        muscleCount,
        exerciseCount,
        exercise,
        muscles,
        exerciseArray,
        userToshiftMap,
        followersCount,
        followingCount,
        workout,
        analytics,
        showEditPage,
      } = action.payload;

      return {
        ...state,
        loading: false,
        error: null,
        bio: bio,
        email: email,
        gender: gender,
        location: street + " " + city + " " + state,
        fullName: fullName,
        userType: userType,
        description: description,
        createdAt: createdAt,
        monthlyCharge: monthlyCharge,
        contactNumber: contactNumber,
        profileImage: profileImage,
        showFollowButton: showFollowButton,
        showJoinedGym: showjoinedgym,
        allShifts: allShifts,
        activeMonths: activeMonths,
        joinedGym: joinedGym,
        joinedBy: joinedBy,
        followingList: followingList,
        followersList: followersList,
        muscleCount: muscleCount,
        exerciseCount: exerciseCount,
        muscleFreq: exercise,
        exerciseFreq: muscles,
        HeatMap: exerciseArray,
        userToshiftMap: userToshiftMap,
        followersCount: followersCount,
        followingCount: followingCount,
        workout: workout,
        analytics: analytics,
        showEditPage: showEditPage,
      };
    }

    case FETCH_PROFILE_DATA_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_PERSONAL_PROFILE_DATA_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SET_PERSONAL_PROFILE_DATA:
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        fullName: action.payload?.fullName,
        bio: action.payload?.bio,
        description: action?.payload?.description,
        contactNumber: action.payload?.contactNumber,
        gender: action.payload?.gender,
        profileImage: action.payload?.profileImage,
      };

    case CREATE_NEW_SHIFT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_NEW_SHIFT_SUCCESS:
      console.log(action.payload, "new shift");
      return {
        ...state,
        loading: false,
        error: null,
        allShifts: [...state.allShifts, action.payload],
      };

    case CREATE_NEW_SHIFT_FAILED:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case DELETE_SHIFT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_SHIFT_SUCCESS:
      return {
        ...state,
        allShifts: state.allShifts.filter(
          (shift) => shift._id !== action.payload
        ),
        loading: false,
        error: null,
      };

    case UPDATE_SHIFT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_SHIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        allShifts: state.allShifts.map((shift) =>
          shift._id === action.payload._id
            ? {
                ...shift,
                limit: action.payload.limit,
                startTime: action.payload.startTime,
                endTime: action.payload.endTime,
                status: action.payload.status,
              }
            : shift
        ),
      };

    default:
      return state;
  }
};

export default profileReducer;
