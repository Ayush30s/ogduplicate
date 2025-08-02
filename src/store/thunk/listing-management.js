import {
  fetchAllListingsRequest,
  fetchAllListingsSuccess,
  fetchAllListingsFailure,
  addListingsRequest,
  addListingsSuccess,
  addListingsFailure,
  deleteListingsRequest,
  deleteListingsSuccess,
  deleteListingsFailure,
  fetchMyListingRequest,
  fetchMyListingSuccess,
  fetchMyListingFailed,
} from "../actions/listing";

import {
  fetchListingDetailsRequest,
  fetchListingDetailsSuccess,
  fetchListingDetailsFailure,
  updateListingsRequest,
  updateListingsFailure,
  updateListingLikes,
  updateListingReports,
} from "../actions/listingActive";

const allListingsThunk = (filters) => async (dispatch) => {
  dispatch(fetchAllListingsRequest());
  try {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
    ).toString();

    const res = await fetch(
      `https://gymbackenddddd-1.onrender.com/listing/all?${query}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message);
    }

    dispatch(fetchAllListingsSuccess(data.data || []));
  } catch (err) {
    dispatch(fetchAllListingsFailure(err.message));
  }
};

const addNewListingThunk = (data, navigate) => async (dispatch) => {
  dispatch(addListingsRequest());
  try {
    const res = await fetch(
      "https://gymbackenddddd-1.onrender.com/listing/new",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    console.log(res);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const listingData = await res.json();
    const { _id } = listingData.data;
    navigate(`/listing/${_id}`);

    dispatch(addListingsSuccess(_id));
  } catch (error) {
    console.log(error.message);
    dispatch(addListingsFailure(error.message));
  }
};

const fetchListingDataThunk = (listingId) => async (dispatch) => {
  dispatch(fetchListingDetailsRequest());
  try {
    const res = await fetch(
      `https://gymbackenddddd-1.onrender.com/listing/${listingId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const { data } = await res.json();
    console.log(data);
    dispatch(fetchListingDetailsSuccess(data));
  } catch (error) {
    console.log(error.message);
    dispatch(fetchListingDetailsFailure(error.message));
  }
};

const updateListingThunk =
  (listingId, submissionData, navigate) => async (dispatch) => {
    dispatch(updateListingsRequest());
    try {
      const res = await fetch(
        `https://gymbackenddddd-1.onrender.com/listing/update/${listingId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message);
      }

      // dispatch(updateListingsSuccess(data.data));
      navigate(`/listing/${listingId}`);
    } catch (error) {
      console.log(error.message);
      dispatch(updateListingsFailure(error.message));
    }
  };

const handleLikeListingThunk = (listingId) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://gymbackenddddd-1.onrender.com/listing/like/${listingId}`,
      {
        method: "Post",
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log(data, "-----------------------=-");

    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(updateListingLikes(data.data));
  } catch (error) {
    console.log(error.message);
  }
};

const handleReportListingThunk =
  (listingId, { message, reason }) =>
  async (dispatch) => {
    console.log(message, reason, "6879807645x3--");
    try {
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/listing/report/${listingId}`,
        {
          method: "Post",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            message: message,
            reason: reason,
          }),
        }
      );

      const data = await response.json();
      console.log(data, "-----------------------=-");

      if (!response.ok) {
        throw new Error(data.message);
      }

      dispatch(updateListingReports(data.data));
    } catch (error) {
      console.log(error.message);
    }
  };

const handleDeleteThunk = (listingId) => async (dispatch) => {
  dispatch(deleteListingsRequest());

  try {
    const response = await fetch(
      `https://gymbackenddddd-1.onrender.com/listing/delete/${listingId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    let data = {};
    try {
      data = await response.json(); // attempt to parse JSON
    } catch (jsonError) {
      console.warn("Failed to parse JSON:", jsonError.message);
    }

    if (!response.ok) {
      const message =
        data.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    dispatch(deleteListingsSuccess(listingId));
  } catch (error) {
    console.error("Delete error:", error.message);
    dispatch(deleteListingsFailure(error.message));
  }
};

const handleMyListingThunk = () => async (dispatch) => {
  dispatch(fetchMyListingRequest());
  try {
    const response = await fetch(
      "https://gymbackenddddd-1.onrender.com/listing/mylisting",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(fetchMyListingSuccess(data.data));
  } catch (error) {
    dispatch(fetchMyListingFailed(error.message));
  }

  return;
};

export {
  handleMyListingThunk,
  allListingsThunk,
  handleDeleteThunk,
  updateListingThunk,
  addNewListingThunk,
  fetchListingDataThunk,
  handleLikeListingThunk,
  handleReportListingThunk,
};
