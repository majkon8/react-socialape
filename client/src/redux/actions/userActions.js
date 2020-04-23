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
  FORGOT_PASSWORD,
  STOP_LOADING_USER,
} from "../types";
import axios from "axios";
import { clearErrors } from "./dataActions";

// Login
export const loginUser = (userData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch(clearErrors());
      window.location.href = "/";
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

// Signup
export const signupUser = (newUserData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      window.location.href = "/";
    })
    .catch((err) => dispatch({ type: SET_ERRORS, payload: err.response.data }));
};

// Logout
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

// Get logged in user data
export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then((res) => {
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch((err) => console.log(err));
};

// Upload an image
export const uploadUserImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user/image", formData)
    .then(() => dispatch(getUserData()))
    .catch((err) => {
      dispatch({type: STOP_LOADING_USER})
      console.log(err);
    });
};

// Edit user details
export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user", userDetails)
    .then(() => dispatch(getUserData()))
    .catch((err) => console.log(err));
};

// Mark notifications read
export const markNotificationsRead = (notificationIds) => (dispatch) =>
  axios
    .post("/notifications", notificationIds)
    .then(() => dispatch({ type: MARK_NOTIFICATIONS_READ }))
    .catch((err) => console.log(err));

// Follow profile
export const follow = (userHandle) => (dispatch) =>
  axios
    .post(`/user/${userHandle}/follow`)
    .then((res) => dispatch({ type: FOLLOW, payload: res.data }))
    .catch((err) => console.log(err));

// Unfollow profile
export const unfollow = (userHandle) => (dispatch) =>
  axios
    .post(`/user/${userHandle}/unfollow`)
    .then((res) => dispatch({ type: UNFOLLOW, payload: res.data }))
    .catch((err) => console.log(err));

// Change user's password
export const changePassword = (credentials) => (dispatch) =>
  axios
    .post("user/password", credentials)
    .then(() => {
      dispatch({
        type: SET_SUCCESSES,
        payload: { success: "Password changed" },
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
      dispatch({ type: CLEAR_SUCCESSES });
    });

// Send password reset email
export const sendPasswordResetEmail = (email) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("user/forgot", email)
    .then(() => {
      dispatch({
        type: SET_SUCCESSES,
        payload: { success: "Check your email to reset password" },
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
      dispatch({ type: CLEAR_SUCCESSES });
    });
};

// Set auth header
const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
