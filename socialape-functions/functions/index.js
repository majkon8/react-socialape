const functions = require("firebase-functions");
const app = require("express")();
const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
  deleteComment
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
  follow,
  unfollow,
  getFollowUsersDetails
} = require("./handlers/users");
const {
  handleCreateNotificationOnLike,
  handleDeleteNotificationOnUnlike,
  handleCreateNotificationOnComment,
  handleDeleteNotificationOnCommentDelete,
  handleOnUserImageChange,
  handleOnScreamDelete,
  handleCreateNotificationOnFollow,
  handleDeleteNotificationOnUnfollow
} = require("./dbtriggers");
const FBAuth = require("./util/fbAuth");
const cors = require("cors");

app.use(cors());

// SCREAM ROUTES

app.get("/screams", FBAuth, getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.delete("/scream/:screamId/comment/:commentId", FBAuth, deleteComment);

// USERS ROUTES

app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);
app.post("/user/:handle/follow", FBAuth, follow);
app.post("/user/:handle/unfollow", FBAuth, unfollow);
app.get("/user/:handle/followers", FBAuth, (req, res) =>
  getFollowUsersDetails(req, res, "followers")
);
app.get("/user/:handle/following", FBAuth, (req, res) =>
  getFollowUsersDetails(req, res, "following")
);

exports.api = functions.region("europe-west1").https.onRequest(app);

// DB TRIGGERS
// Create notification on like
exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(handleCreateNotificationOnLike);

// Delete notification on unlike
exports.deleteNotificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(handleDeleteNotificationOnUnlike);

// Create notification on comment
exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(handleCreateNotificationOnComment);

// Delete notification on comment delete
exports.deleteNotificationOnCommentDelete = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onDelete(handleDeleteNotificationOnCommentDelete);

// Create notification on follow
exports.createNotificationOnFollow = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(handleCreateNotificationOnFollow);

// Delete notification on unfollow
exports.deleteNotificationOnUnfollow = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(handleDeleteNotificationOnUnfollow);

// Handle user image change
exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(handleOnUserImageChange);

// Handle deleting scream
exports.onScreamDelete = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onDelete(handleOnScreamDelete);
