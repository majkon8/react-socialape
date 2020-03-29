import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  TOGGLE_SEARCH_FOR_USERS
} from "../types";

const initialState = {
  loading: false,
  errors: null,
  isToggledSearchForUsers:
    localStorage.getItem("isToggledSearchForUsers") === "false" ? false : true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return { ...state, loading: false, errors: action.payload };
    case CLEAR_ERRORS:
      return { ...state, loading: false, errors: null };
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
        isToggledSearchForUsers: !state.isToggledSearchForUsers
      };
    default:
      return state;
  }
}
