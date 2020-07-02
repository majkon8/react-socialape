const functions = require("firebase-functions");
const app = require("express")();
const {
  getAllScreams,
  postScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
  deleteComment,
  searchForScreams,
  uploadScreamImage,
  shareScream,
  replyToScream,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadUserImage,
  changeUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
  follow,
  unfollow,
  getFollowUsersDetails,
  searchForUser,
  changePassword,
  sendPasswordResetEmail,
} = require("./handlers/users");
const {
  handleCreateNotificationOnLike,
  handleDeleteNotificationOnUnlike,
  handleCreateNotificationOnComment,
  handleDeleteNotificationOnCommentDelete,
  handleOnUserImageChange,
  handleOnScreamDelete,
  handleOnNicknameChange,
  handleCreateNotificationOnFollow,
  handleDeleteNotificationOnUnfollow,
  handleCreateNotificationOnShare,
  handleDeleteNotificationOnUnshare,
  handleCreateNotificationOnReply,
  handleDeleteNotificationOnUnreply,
} = require("./dbtriggers");
const FBAuth = require("./middleware/fbAuth");
const cors = require("cors");

app.use(cors({ origin: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  next();
});

// SCREAM ROUTES

app.get("/screams", FBAuth, getAllScreams);
app.post("/scream", FBAuth, postScream);
app.get("/scream/:screamId", getScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.delete("/scream/:screamId/comment/:commentId", FBAuth, deleteComment);
app.get("/scream/search/:tag", FBAuth, searchForScreams);
app.post("/scream/image", FBAuth, uploadScreamImage);
app.post("/scream/share", FBAuth, shareScream);
app.post("/scream/reply", FBAuth, replyToScream);

// USERS ROUTES

app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadUserImage);
app.post("/user", FBAuth, changeUserDetails);
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
app.get("/user/search/:name", FBAuth, searchForUser);
app.post("/user/password", changePassword);
app.post("/user/forgot", sendPasswordResetEmail);

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

// Handle notificiation on share
exports.createNotificationOnShare = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onUpdate(handleCreateNotificationOnShare);

exports.deleteNotificationOnUnshare = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onUpdate(handleDeleteNotificationOnUnshare);

// Handle notification on reply
exports.createNotificationOnReply = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onUpdate(handleCreateNotificationOnReply);

exports.deleteNotificationOnUnreply = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onUpdate(handleDeleteNotificationOnUnreply);

// Handle user image change
exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(handleOnUserImageChange);

exports.onNicknameChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(handleOnNicknameChange);

// Handle deleting scream
exports.onScreamDelete = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onDelete(handleOnScreamDelete);
