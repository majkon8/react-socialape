import {
  SET_USER,
  SET_ERRORS,
  SET_SUCCESSES,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  FOLLOW,
  UNFOLLOW,
  CLEAR_SUCCESSES,
  STOP_LOADING_USER,
} from "../types";
import axios from "axios";
import { clearErrors, clearSuccesses } from "./uiActions";

// Login
export const loginUser = (userData) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post("/login", userData);
    setAuthorizationHeader(res.data);
    dispatch(getUserData());
    dispatch(clearErrors());
    dispatch(clearSuccesses());
    window.location.href = "/";
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};

// Signup
export const signupUser = (newUserData) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post("/signup", newUserData);
    setAuthorizationHeader(res.data);
    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });
    window.location.href = "/";
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};

// Get logged in user data
export const getUserData = () => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.get("/user");
    dispatch({ type: SET_USER, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

// Upload an image
export const uploadUserImage = (formData) => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    await axios.post("/user/image", formData);
    dispatch(getUserData());
  } catch (err) {
    dispatch({ type: STOP_LOADING_USER });
    console.log(err);
  }
};

// Edit user details
export const editUserDetails = (userDetails) => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    await axios.post("/user", userDetails);
    dispatch(getUserData());
  } catch (err) {
    console.log(err);
  }
};

// Mark notifications read
export const markNotificationsRead = (notificationIds) => async (dispatch) => {
  try {
    await axios.post("/notifications", notificationIds);
    dispatch({ type: MARK_NOTIFICATIONS_READ });
  } catch (err) {
    console.log(err);
  }
};

// Follow profile
export const follow = (userHandle) => async (dispatch) => {
  try {
    const res = await axios.post(`/user/${userHandle}/follow`);
    dispatch({ type: FOLLOW, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

// Unfollow profile
export const unfollow = (userHandle) => async (dispatch) => {
  try {
    const res = await axios.post(`/user/${userHandle}/unfollow`);
    dispatch({ type: UNFOLLOW, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

// Change user's password
export const changePassword = (credentials) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    await axios.post("user/password", credentials);
    dispatch({
      type: SET_SUCCESSES,
      payload: { success: "Password changed" },
    });
    dispatch({ type: CLEAR_ERRORS });
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
    dispatch({ type: CLEAR_SUCCESSES });
  }
};

// Send password reset email
export const sendPasswordResetEmail = (email) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    await axios.post("user/forgot", email);
    dispatch({
      type: SET_SUCCESSES,
      payload: { success: "Check your email to reset password" },
    });
    dispatch({ type: CLEAR_ERRORS });
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
    dispatch({ type: CLEAR_SUCCESSES });
  }
};

// Set auth header
export const setAuthorizationHeader = (userCredentials) => {
  const FBIdToken = `Bearer ${userCredentials.token}`;
  const userEmail = userCredentials.email;
  const userPassword = userCredentials.password;
  const FBRefreshToken = userCredentials.refreshToken;
  localStorage.setItem("FBIdToken", FBIdToken);
  localStorage.setItem("FBRefreshToken", FBRefreshToken);
  if (userEmail && userPassword) {
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userPassword", userPassword);
  }
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

// Logout
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};
