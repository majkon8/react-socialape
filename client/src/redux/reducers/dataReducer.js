import {
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SUBMIT_COMMENT,
  SET_PROFILE,
  DELETE_COMMENT
} from "../types";

const initialState = { screams: [], scream: {}, loading: false, profile: null };

export default function(state = initialState, action) {
  let updatedScream;
  switch (action.type) {
    case LOADING_DATA:
      return { ...state, loading: true };
    case SET_SCREAMS:
      return { ...state, screams: action.payload, loading: false };
    case SET_SCREAM:
      return { ...state, scream: action.payload };
    case SET_PROFILE:
      return { ...state, profile: action.payload };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      const updatedScreams = state.screams.map(scream => {
        scream.screamId === action.payload.screamId &&
          (scream.likeCount = action.payload.likeCount);
        return { ...scream };
      });
      updatedScream = { ...state.scream };
      updatedScream.likeCount = action.payload.likeCount;
      return {
        ...state,
        screams: updatedScreams,
        scream: updatedScream
      };
    case DELETE_SCREAM:
      return {
        ...state,
        screams: state.screams.filter(
          scream => scream.screamId !== action.payload
        )
      };
    case POST_SCREAM:
      return { ...state, screams: [action.payload, ...state.screams] };
    case SUBMIT_COMMENT:
      return {
        ...state,
        screams: state.screams.map(scream => {
          scream.screamId === action.payload.screamId && scream.commentCount++;
          return { ...scream };
        }),
        scream: {
          ...state.scream,
          comments: [action.payload, ...state.scream.comments],
          commentCount: state.scream.commentCount + 1
        }
      };
    case DELETE_COMMENT:
      updatedScream = { ...state.scream };
      updatedScream.comments = state.scream.comments.filter(
        comment => comment.commentId !== action.payload.commentId
      );
      updatedScream.commentCount--;
      return {
        ...state,
        screams: state.screams.map(scream => {
          scream.screamId === action.payload.screamId && scream.commentCount--;
          return { ...scream };
        }),
        scream: updatedScream
      };
    default:
      return state;
  }
}
