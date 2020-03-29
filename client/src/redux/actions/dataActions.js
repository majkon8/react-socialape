import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  POST_SCREAM,
  SET_SCREAM,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  SET_PROFILE,
  DELETE_COMMENT,
  SET_FOLLOWERS,
  SET_FOLLOWING,
  SET_SEARCHED_USERS,
  SET_SEARCHED_SCREAMS
} from "../types";
import axios from "axios";

// Get all screams
export const getScreams = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/screams")
    .then(res => {
      dispatch({ type: SET_SCREAMS, payload: res.data });
    })
    .catch(() => {
      dispatch({ type: SET_SCREAMS, payload: [] });
    });
};

// Get one scream
export const getScream = screamId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/scream/${screamId}`)
    .then(res => {
      dispatch({ type: SET_SCREAM, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
};

//Post a scream
export const postScream = newScream => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/scream", newScream)
    .then(res => {
      dispatch({ type: POST_SCREAM, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => dispatch({ type: SET_ERRORS, payload: err.response.data }));
};

// Like a scream
export const likeScream = screamId => dispatch => {
  axios
    .get(`/scream/${screamId}/like`)
    .then(res => {
      dispatch({ type: LIKE_SCREAM, payload: res.data });
    })
    .catch(err => console.log(err));
};

// Unlike a scream
export const unlikeScream = screamId => dispatch => {
  axios
    .get(`/scream/${screamId}/unlike`)
    .then(res => {
      dispatch({ type: UNLIKE_SCREAM, payload: res.data });
    })
    .catch(err => console.log(err));
};

// Submit a comment
export const submitComment = (screamId, commentData) => dispatch => {
  axios
    .post(`/scream/${screamId}/comment`, commentData)
    .then(res => {
      dispatch({ type: SUBMIT_COMMENT, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => dispatch({ type: SET_ERRORS, payload: err.response.data }));
};

// Delete a comment
export const deleteComment = (screamId, commentId) => dispatch => {
  axios
    .delete(`/scream/${screamId}/comment/${commentId}`)
    .then(() =>
      dispatch({ type: DELETE_COMMENT, payload: { commentId, screamId } })
    )
    .catch(err => console.log(err));
};

// Delete a scream
export const deleteScream = screamId => dispatch => {
  axios
    .delete(`/scream/${screamId}`)
    .then(() => dispatch({ type: DELETE_SCREAM, payload: screamId }))
    .catch(err => console.log(err));
};

// Get any user data
export const getUserData = userHandle => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then(res => {
      dispatch({ type: SET_SCREAMS, payload: res.data.screams });
      dispatch(setProfile(res.data.user));
    })
    .catch(() => dispatch({ type: SET_SCREAMS, payload: null }));
};

// Set selected profile
export const setProfile = payload => dispatch =>
  dispatch({ type: SET_PROFILE, payload: payload });

// Get followers or following users details
export const getFollowUsers = (userHandle, type) => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}/${type}`)
    .then(res => {
      type === "followers"
        ? dispatch(setFollowers(res.data))
        : dispatch(setFollowing(res.data));
    })
    .catch(err => console.log(err));
};

// Search for users
export const searchForUsers = name => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/search/${name}`)
    .then(res => dispatch({ type: SET_SEARCHED_USERS, payload: res.data }))
    .catch(err => console.log(err));
};

// Search for screams
export const searchForScreams = tag => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/scream/search/${tag}`)
    .then(res => dispatch({ type: SET_SEARCHED_SCREAMS, payload: res.data }))
    .catch(err => console.log(err));
};

// Set followers details
export const setFollowers = payload => dispatch =>
  dispatch({ type: SET_FOLLOWERS, payload: payload });

// Set following users details
export const setFollowing = payload => dispatch =>
  dispatch({ type: SET_FOLLOWING, payload: payload });

// Clear errors
export const clearErrors = () => dispatch => dispatch({ type: CLEAR_ERRORS });
