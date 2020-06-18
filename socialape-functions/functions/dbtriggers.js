const { db } = require("./util/admin");

// Create notification on like handler
exports.handleCreateNotificationOnLike = async (snapshot) => {
  try {
    const doc = await db.doc(`/screams/${snapshot.data().screamId}`).get();
    if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
      return db.doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        recipient: doc.data().userHandle,
        sender: snapshot.data().userHandle,
        type: "like",
        read: false,
        screamId: doc.id,
      });
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Delete notification on unlike handler
exports.handleDeleteNotificationOnUnlike = async (snapshot) => {
  try {
    return db.doc(`/notifications/${snapshot.id}`).delete();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Create notification on comment handler
exports.handleCreateNotificationOnComment = async (snapshot) => {
  try {
    const doc = await db.doc(`/screams/${snapshot.data().screamId}`).get();
    if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
      return db.doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        recipient: doc.data().userHandle,
        sender: snapshot.data().userHandle,
        type: "comment",
        read: false,
        screamId: doc.id,
      });
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Delete notification on comment delete handler
exports.handleDeleteNotificationOnCommentDelete = async (snapshot) => {
  try {
    return db.doc(`/notifications/${snapshot.id}`).delete();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Create notification on follow handler
exports.handleCreateNotificationOnFollow = async (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const newFollower = dataAfter.followers.filter(
    (follower) => !dataBefore.followers.includes(follower)
  );
  if (newFollower.length > 0) {
    const notificationId = dataBefore.userId + newFollower[0];
    try {
      return db.doc(`/notifications/${notificationId}`).set({
        createdAt: new Date().toISOString(),
        recipient: dataBefore.handle,
        sender: newFollower[0],
        type: "follow",
        read: false,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return null;
};

// Create notification on sharing post
exports.handleCreateNotificationOnShare = async (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const newShare = dataAfter.shares.filter(
    (share) => !dataBefore.shares.includes(share)
  );
  if (
    newShare.length > 0 &&
    dataBefore.userHandle !== newShare[0].sharedByHandle
  )
    try {
      return db.doc(`/notifications/${newShare[0].screamId}`).set({
        createdAt: new Date().toISOString(),
        recipient: dataBefore.userHandle,
        sender: newShare[0].sharedByHandle,
        screamId: newShare[0].screamId,
        type: "share",
        read: false,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  return null;
};

// Create notification on reply to post
exports.handleCreateNotificationOnReply = async (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const newReply = dataAfter.replies.filter(
    (reply) => !dataBefore.replies.includes(reply)
  );
  if (
    newReply.length > 0 &&
    dataBefore.userHandle !== newReply[0].replyFromHandle
  )
    try {
      return db.doc(`/notifications/${newReply[0].screamId}`).set({
        createdAt: new Date().toISOString(),
        recipient: dataBefore.userHandle,
        sender: newReply[0].replyFromHandle,
        screamId: newReply[0].screamId,
        type: "reply",
        read: false,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  return null;
};

// Delete notification when delete reply to post
exports.handleDeleteNotificationOnUnreply = async (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const unreply = dataBefore.replies.filter(
    (reply) => !dataAfter.replies.includes(reply)
  );
  if (unreply.length > 0)
    try {
      return db.doc(`notifications/${unreply[0].screamId}`).delete();
    } catch (err) {
      console.error(err);
      return null;
    }
  return null;
};

// Delete notification when delete shared post
exports.handleDeleteNotificationOnUnshare = async (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const unshare = dataBefore.shares.filter(
    (share) => !dataAfter.shares.includes(share)
  );
  if (unshare.length > 0)
    try {
      return db.doc(`notifications/${unshare[0].screamId}`).delete();
    } catch (err) {
      console.error(err);
      return null;
    }
  return null;
};

// Delete notification on unfollow
exports.handleDeleteNotificationOnUnfollow = async (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const unfollower = dataBefore.followers.filter(
    (follower) => !dataAfter.followers.includes(follower)
  );
  if (unfollower.length > 0) {
    const notificationId = dataBefore.userId + unfollower[0];
    try {
      return db.doc(`/notifications/${notificationId}`).delete();
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return null;
};

// Handle user image change
exports.handleOnUserImageChange = async (change) => {
  if (change.before.data().imageUrl === change.after.data().imageUrl)
    return null;
  const batch = db.batch();
  try {
    let data = await db
      .collection("screams")
      .where("userHandle", "==", change.before.data().handle)
      .get();
    data.forEach(async (doc) => {
      const scream = db.doc(`/screams/${doc.id}`);
      const screamDoc = await scream.get();
      const screamData = screamDoc.data();
      if (screamData.sharedFromHandle) return;
      batch.update(scream, { userImage: change.after.data().imageUrl });
    });
    data = await db
      .collection("comments")
      .where("userHandle", "==", change.before.data().handle)
      .get();
    data.forEach((doc) => {
      const comment = db.doc(`/comments/${doc.id}`);
      batch.update(comment, {
        userImage: change.after.data().imageUrl,
      });
    });
    return batch.commit();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Handle nickname change
exports.handleOnNicknameChange = async (change) => {
  const nicknameAfterChange = change.after.data().nickname;
  if (change.before.data().nickname === nicknameAfterChange) return null;
  const handleBeforeChange = change.before.data().handle;
  const nicknameBeforeChange = change.before.data().nickname;
  const batch = db.batch();
  try {
    let data = await db
      .collection("screams")
      .where("userHandle", "==", handleBeforeChange)
      .get();
    data.forEach((doc) => {
      const scream = db.doc(`/screams/${doc.id}`);
      batch.update(scream, { userNickname: nicknameAfterChange });
    });
    data = await db
      .collection("comments")
      .where("userHandle", "==", handleBeforeChange)
      .get();
    data.forEach((doc) => {
      const comment = db.doc(`/comments/${doc.id}`);
      batch.update(comment, {
        userNickname: nicknameAfterChange,
      });
    });
    data = await db
      .collection("screams")
      .where("sharedFromNickname", "==", nicknameBeforeChange)
      .get();
    data.forEach((doc) => {
      const scream = db.doc(`/screams/${doc.id}`);
      batch.update(scream, { sharedFromNickname: nicknameAfterChange });
    });
    data = await db
      .collection("screams")
      .where("replyToNickname", "==", nicknameBeforeChange)
      .get();
    data.forEach((doc) => {
      const scream = db.doc(`/screams/${doc.id}`);
      batch.update(scream, { replyToNickname: nicknameAfterChange });
    });
    return batch.commit();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Handle deleting scream
exports.handleOnScreamDelete = async (snapshot, context) => {
  const screamId = context.params.screamId;
  const batch = db.batch();
  try {
    let data = await db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get();
    data.forEach((doc) => {
      batch.delete(db.doc(`/comments/${doc.id}`));
    });
    data = await db.collection("likes").where("screamId", "==", screamId).get();
    data.forEach((doc) => {
      batch.delete(db.doc(`/likes/${doc.id}`));
    });
    data = await db
      .collection("notifications")
      .where("screamId", "==", screamId)
      .get();
    data.forEach((doc) => {
      batch.delete(db.doc(`/notifications/${doc.id}`));
    });
    return batch.commit();
  } catch (err) {
    console.error(err);
    return null;
  }
};
