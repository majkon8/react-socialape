import {
  SET_ERRORS,
  SET_SUCCESSES,
  CLEAR_SUCCESSES,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  TOGGLE_SEARCH_FOR_USERS,
} from "../types";

const initialState = {
  loading: false,
  errors: null,
  successes: null,
  isToggledSearchForUsers:
    localStorage.getItem("isToggledSearchForUsers") === "false" ? false : true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return { ...state, loading: false, errors: action.payload };
    case CLEAR_ERRORS:
      return { ...state, loading: false, errors: null };
    case SET_SUCCESSES:
      return { ...state, loading: false, successes: action.payload };
    case CLEAR_SUCCESSES:
      return { ...state, loading: false, successes: null };
    case LOADING_UI:
      return { ...state, loading: true };
    case STOP_LOADING_UI:
      return { ...state, loading: false };
    case TOGGLE_SEARCH_FOR_USERS:
      localStorage.setItem(
        "isToggledSearchForUsers",
        !state.isToggledSearchForUsers
      );
      return {
        ...state,
        isToggledSearchForUsers: !state.isToggledSearchForUsers,
      };
    default:
      return state;
  }
}
