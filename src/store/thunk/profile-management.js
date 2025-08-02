import {
  requestProfileData,
  setPersonalProfileData,
  setProfileDataFailed,
  setProfileDataSuccess,
  setPersonalProfileDataReq,
  setNewShiftRequest,
  setNewShiftSuccess,
  setNewShiftFail,
  setShiftDeleteFail,
  setShiftDeleteSuccess,
  setUpdateShiftFail,
  setUpdateShiftSuccess,
} from "../actions/profile";

const profileDataThuk = (userType) => async (dispatch) => {
  console.log(userType);
  dispatch(requestProfileData());
  try {
    const response = await fetch(
      `https://gymbackenddddd-1.onrender.com/home/${
        userType === "userModel" ? "user/dashboard" : "gym/dashboard"
      }`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
      throw new Error(error.message);
    }

    const data = await response.json();
    console.log(data);
    dispatch(setProfileDataSuccess(data));
  } catch (error) {
    dispatch(setProfileDataFailed(error.message));
  }
};

const updatePersonalProfileDataThunk = (userdata) => async (dispatch) => {
  try {
    dispatch(setPersonalProfileDataReq());
    const response = await fetch(
      "https://gymbackenddddd-1.onrender.com/home/update-dashboard-personalDetails",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      }
    );

    console.log(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    dispatch(setPersonalProfileData(userdata));
  } catch (error) {
    dispatch(setProfileDataFailed(error.message));
  }
};

const createNewShiftThunk =
  ({ formData, userId }) =>
  async (dispatch) => {
    try {
      dispatch(setNewShiftRequest());
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/home/gym/${userId}/new-shift`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      dispatch(setNewShiftSuccess(data.newShift));
    } catch (error) {
      dispatch(setNewShiftFail(error.message));
    }
  };

const deleteShiftThunk = (shiftId) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://gymbackenddddd-1.onrender.com/home/gym/remove-shift/${shiftId}`,
      {
        method: "Delete",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data);
    }

    dispatch(setShiftDeleteSuccess(shiftId));
  } catch (err) {
    console.log(err.message);
    dispatch(setShiftDeleteFail(err.message));
  }
};

//make update shit Thubk and handle it
const updateShiftThunk = (data) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://gymbackenddddd-1.onrender.com/home/gym/edit-shift/${data._id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const result = await response.json();
    dispatch(setUpdateShiftSuccess(result.shift));
  } catch (error) {
    dispatch(setUpdateShiftFail(error.message));
  }
};

export {
  profileDataThuk,
  updatePersonalProfileDataThunk,
  createNewShiftThunk,
  deleteShiftThunk,
  updateShiftThunk,
};
