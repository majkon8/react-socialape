import {
  TOGGLE_SEARCH_FOR_USERS,
  CLEAR_ERRORS,
  CLEAR_SUCCESSES,
} from "../types";

export const toggleSearchForUsers = () => (dispatch) =>
  dispatch({ type: TOGGLE_SEARCH_FOR_USERS });

export const clearErrors = () => (dispatch) => dispatch({ type: CLEAR_ERRORS });

export const clearSuccesses = () => (dispatch) =>
  dispatch({ type: CLEAR_SUCCESSES });
