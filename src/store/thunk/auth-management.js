import {
  setLoginData,
  setLoginFailed,
  setLoginRequest,
  setLogoutUser,
} from "../actions/auth";

const onLogin = (loginData, navigate) => async (dispatch) => {
  dispatch(setLoginRequest());

  try {
    const body = {
      email: loginData.email || "",
      password: loginData.password || "",
    };

    const response = await fetch(
      `https://gymbackenddddd-1.onrender.com/register/signin`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    const data = await response.json(); // Properly handle response JSON
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(setLoginData(data.user));
    navigate("/home");
  } catch (error) {
    dispatch(setLoginFailed(error.message));
  }
};

const onLogoutThunk = (navigate) => async (dispatch) => {
  try {
    const response = await fetch(
      "https://gymbackenddddd-1.onrender.com/register/signout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(response);
    }

    if (data.msg === "SIGNOUT_SUCCESSFULL") {
      navigate("/");
      dispatch(setLogoutUser());
    }
  } catch (error) {
    console.log("Logout error:", error.msg);
  }
};

export { onLogin, onLogoutThunk };
