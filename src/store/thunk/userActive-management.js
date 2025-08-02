import {
  userDataRequestPending,
  userDataRequestFailure,
  userDataRequestSuccess,
  userPageFollowRequestFailed,
  userPageFollowRequestPending,
  userPageFollowRequestSuccess,
} from "../actions/userActive";

// Constants for API configuration
const API_BASE_URL = "https://gymbackenddddd-1.onrender.com";
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Fetches active user data with industry-standard practices
 * @param {string} userId - ID of the user to fetch
 */
const fetchActiveUserDataThunk = (userId) => async (dispatch) => {
  if (!userId) {
    dispatch(userDataRequestFailure("User ID is required"));
    return;
  }

  dispatch(userDataRequestPending());

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}/home/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check content type before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      throw new Error(
        `Invalid content type: ${contentType} - ${errorText.substring(0, 100)}`
      );
    }

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      // Handle API-specific error formats
      const errorMessage =
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    // Validate response structure
    if (!data.userData) {
      throw new Error("Invalid user data structure received");
    }

    dispatch(userDataRequestSuccess(data));
  } catch (error) {
    console.log(error);
    clearTimeout(timeoutId);

    // Handle specific error types
    let errorMessage = error.message;

    if (error.name === "AbortError") {
      errorMessage = "Request timed out";
    } else if (error instanceof SyntaxError) {
      errorMessage = "Invalid JSON response";
    }

    console.error("User data fetch error:", error);
    dispatch(userDataRequestFailure(errorMessage));
  }
};

const followRequestThunk = (route) => async (dispatch) => {
  dispatch(userPageFollowRequestPending());

  try {
    const response = await fetch(`${API_BASE_URL}/request/${route}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();
    console.log(data.message);

    if (!response.ok) {
      throw new Error(data.message || "Failed to update follow status");
    }

    dispatch(userPageFollowRequestSuccess(data.message));
  } catch (err) {
    dispatch(userPageFollowRequestFailed(err.message));
    console.error("Error updating follow status:", err);
  }
};

export { fetchActiveUserDataThunk, followRequestThunk };
