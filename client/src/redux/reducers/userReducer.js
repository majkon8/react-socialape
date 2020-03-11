import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  MARK_NOTIFICATIONS_READ,
  FOLLOW,
  UNFOLLOW
} from "../types";

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  notifications: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, authenticated: true };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return { authenticated: true, loading: false, ...action.payload };
    case LOADING_USER:
      return { ...state, loading: true };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            screamId: action.payload.screamId
          }
        ]
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          like => like.screamId !== action.payload.screamId
        )
      };
    case MARK_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map(not => {
          not.read = true;
          return not;
        })
      };
    case FOLLOW:
      return { ...state, credentials: { ...action.payload } };
    case UNFOLLOW:
      return { ...state, credentials: { ...action.payload } };
    default:
      return state;
  }
}
