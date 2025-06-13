import {
  requestActionFailed,
  requestActionPending,
  requestActionSuccess,
  fetchAllRequestSuccess,
  updateStatusFailed,
  updateStatusRequest,
  updateStatusSuccess,
  deletNotificationSuccess,
} from "../actions/request";

const requestActionThunk = (data) => async (dispatch) => {
  console.log("request action thunk", data);
  dispatch(requestActionPending());

  try {
    const response = await fetch("http://localhost:7000/notify/handleRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Something went wrong");
    }

    const resdata = await response.json();
    console.log("single thunk adata", resdata);

    dispatch(requestActionSuccess(resdata.data));
  } catch (err) {
    console.log(err.message);
    dispatch(requestActionFailed(err.message));
  }
};

const fetchAllRequestThunk = (reqAction) => async (dispatch) => {
  try {
    const response = await fetch(
      `http://localhost:7000/notify/allnotifications/${reqAction}`,
      {
        method: "Get",
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("data-----------------------------", data);

    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(fetchAllRequestSuccess(data.data));
  } catch (error) {
    console.error("Error fetching requests:", error.message);
  }
};

// Thunk to change request status
const changeRequestStatusThunk = (data) => async (dispatch) => {
  dispatch(updateStatusRequest());
  try {
    const response = await fetch(
      "http://localhost:7000/notify/updatejoinstatus",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    const resdata = await response.json();
    if (!response.ok) {
      throw new Error(resdata.message);
    }
    dispatch(updateStatusSuccess(data));
  } catch (error) {
    console.log(error.message);
    dispatch(updateStatusFailed(error.message));
  }
};

const deleteNotificationThunk = (notification) => async (dispatch) => {
  try {
    const response = await fetch(
      `http://localhost:7000/notify/deleteNotification`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(notification),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(deletNotificationSuccess(notification._id));
  } catch (error) {
    console.log(error);
  }
};

export {
  requestActionThunk,
  fetchAllRequestThunk,
  changeRequestStatusThunk,
  deleteNotificationThunk,
};
