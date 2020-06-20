import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  LOADING_UI,
  SET_ERRORS,
  POST_SCREAM,
  SET_SCREAM,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  SET_PROFILE,
  DELETE_COMMENT,
  SET_FOLLOWERS,
  SET_FOLLOWING,
  SET_SEARCHED_USERS,
  SET_SEARCHED_SCREAMS,
  SHARE_SCREAM,
  REPLY_TO_SCREAM,
} from "../types";
import axios from "axios";
import { clearErrors } from "./uiActions";

// Get all screams
export const getScreams = () => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get("/screams");
    dispatch({ type: SET_SCREAMS, payload: res.data });
  } catch (err) {
    dispatch({ type: SET_SCREAMS, payload: [] });
  }
};

// Get one scream
export const getScream = async (screamId) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.get(`/scream/${screamId}`);
    dispatch({ type: SET_SCREAM, payload: res.data });
    dispatch({ type: STOP_LOADING_UI });
  } catch (err) {
    console.log(err);
  }
};

//Post a scream
export const postScream = (newScream) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post("/scream", newScream);
    dispatch({ type: POST_SCREAM, payload: res.data });
    dispatch(clearErrors());
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};

export const shareScream = (sharedScream) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post("/scream/share", sharedScream);
    dispatch({ type: SHARE_SCREAM, payload: res.data });
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};

export const replyToScream = (reply) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post("/scream/reply", reply);
    dispatch({ type: REPLY_TO_SCREAM, payload: res.data });
    dispatch(clearErrors());
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};

// Like a scream
export const likeScream = (screamId) => async (dispatch) => {
  try {
    const res = await axios.get(`/scream/${screamId}/like`);
    dispatch({ type: LIKE_SCREAM, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

// Unlike a scream
export const unlikeScream = (screamId) => async (dispatch) => {
  try {
    const res = await axios.get(`/scream/${screamId}/unlike`);
    dispatch({ type: UNLIKE_SCREAM, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

// Submit a comment
export const submitComment = (screamId, commentData) => async (dispatch) => {
  try {
    const res = await axios.post(`/scream/${screamId}/comment`, commentData);
    dispatch({ type: SUBMIT_COMMENT, payload: res.data });
    dispatch(clearErrors());
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};

// Delete a comment
export const deleteComment = (screamId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/scream/${screamId}/comment/${commentId}`);
    dispatch({ type: DELETE_COMMENT, payload: { commentId, screamId } });
  } catch (err) {
    console.log(err);
  }
};

// Delete a scream
export const deleteScream = (screamId) => async (dispatch) => {
  try {
    await axios.delete(`/scream/${screamId}`);
    dispatch({ type: DELETE_SCREAM, payload: screamId });
  } catch (err) {
    console.log(err);
  }
};

// Get any user data
export const getUserData = (userHandle) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get(`/user/${userHandle}`);
    dispatch({ type: SET_SCREAMS, payload: res.data.screams });
    dispatch(setProfile(res.data.user));
  } catch (err) {
    dispatch({ type: SET_SCREAMS, payload: null });
  }
};

// Get followers or following users details
export const getFollowUsers = (userHandle, type) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get(`/user/${userHandle}/${type}`);
    type === "followers"
      ? dispatch(setFollowers(res.data))
      : dispatch(setFollowing(res.data));
  } catch (err) {
    console.log(err);
  }
};

// Search for users
export const searchForUsers = (name) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get(`/user/search/${name}`);
    dispatch({ type: SET_SEARCHED_USERS, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

// Search for screams
export const searchForScreams = (tag) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get(`/scream/search/${tag}`);
    dispatch({ type: SET_SEARCHED_SCREAMS, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

// Set selected profile
export const setProfile = (payload) => (dispatch) =>
  dispatch({ type: SET_PROFILE, payload: payload });

// Set followers details
export const setFollowers = (payload) => (dispatch) =>
  dispatch({ type: SET_FOLLOWERS, payload: payload });

// Set following users details
export const setFollowing = (payload) => (dispatch) =>
  dispatch({ type: SET_FOLLOWING, payload: payload });
