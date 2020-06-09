const { db } = require("./util/admin");

// Create notification on like handler
exports.handleCreateNotificationOnLike = (snapshot) =>
  db
    .doc(`/screams/${snapshot.data().screamId}`)
    .get()
    .then((doc) => {
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
    })
    .catch((err) => {
      console.error(err);
      return;
    });

// Delete notification on unlike handler
exports.handleDeleteNotificationOnUnlike = (snapshot) => {
  return db
    .doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch((err) => {
      console.error(err);
      return;
    });
};

// Create notification on comment handler
exports.handleCreateNotificationOnComment = (snapshot) => {
  return db
    .doc(`/screams/${snapshot.data().screamId}`)
    .get()
    .then((doc) => {
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
    })
    .catch((err) => {
      console.error(err);
      return;
    });
};

// Delete notification on comment delete handler
exports.handleDeleteNotificationOnCommentDelete = (snapshot) => {
  return db
    .doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch((err) => {
      console.error(err);
      return;
    });
};

// Create notification on follow handler
exports.handleCreateNotificationOnFollow = (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const newFollower = dataAfter.followers.filter(
    (follower) => !dataBefore.followers.includes(follower)
  );
  if (newFollower.length > 0) {
    const notificationId = dataBefore.userId + newFollower[0];
    return db
      .doc(`/notifications/${notificationId}`)
      .set({
        createdAt: new Date().toISOString(),
        recipient: dataBefore.handle,
        sender: newFollower[0],
        type: "follow",
        read: false,
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  }
  return null;
};

exports.handleCreateNotificationOnShare = (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const newShare = dataAfter.shares.filter(
    (share) => !dataBefore.shares.includes(share)
  );
  if (newShare.length > 0)
    return db
      .doc(`/notifications/${newShare[0].screamId}`)
      .set({
        createdAt: new Date().toISOString(),
        recipient: dataBefore.userHandle,
        sender: newShare[0].sharedByHandle,
        screamId: newShare[0].screamId,
        type: "share",
        read: false,
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  return;
};

exports.handleDeleteNotificationOnUnshare = (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const unshare = dataBefore.shares.filter(
    (share) => !dataAfter.shares.includes(share)
  );
  if (unshare.length > 0)
    return db
      .doc(`notifications/${unshare[0].screamId}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
};

// Delete notification on unfollow
exports.handleDeleteNotificationOnUnfollow = (change) => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const unfollower = dataBefore.followers.filter(
    (follower) => !dataAfter.followers.includes(follower)
  );
  if (unfollower.length > 0) {
    const notificationId = dataBefore.userId + unfollower[0];
    return db
      .doc(`/notifications/${notificationId}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  }
  return null;
};

// Handle user image change
exports.handleOnUserImageChange = (change) => {
  if (change.before.data().imageUrl !== change.after.data().imageUrl) {
    const batch = db.batch();
    return db
      .collection("screams")
      .where("userHandle", "==", change.before.data().handle)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          const scream = db.doc(`/screams/${doc.id}`);
          batch.update(scream, { userImage: change.after.data().imageUrl });
        });
        return db
          .collection("comments")
          .where("userHandle", "==", change.before.data().handle)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          const comment = db.doc(`/comments/${doc.id}`);
          batch.update(comment, {
            userImage: change.after.data().imageUrl,
          });
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  } else return true;
};

// Handle nickname change
exports.handleOnNicknameChange = (change) => {
  const nicknameAfterChange = change.after.data().nickname;
  if (change.before.data().nickname !== nicknameAfterChange) {
    const handleBeforeChange = change.before.data().handle;
    const batch = db.batch();
    return db
      .collection("screams")
      .where("userHandle", "==", handleBeforeChange)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          const scream = db.doc(`/screams/${doc.id}`);
          batch.update(scream, { userNickname: nicknameAfterChange });
        });
        return db
          .collection("comments")
          .where("userHandle", "==", handleBeforeChange)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          const comment = db.doc(`/comments/${doc.id}`);
          batch.update(comment, {
            userNickname: nicknameAfterChange,
          });
        });
        return db
          .collection("screams")
          .where("sharedByHandle", "==", handleBeforeChange)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          const scream = db.doc(`/screams/${doc.id}`);
          batch.update(scream, { sharedByNickname: nicknameAfterChange });
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  } else return true;
};

// Handle deleting scream
exports.handleOnScreamDelete = (snapshot, context) => {
  const screamId = context.params.screamId;
  const batch = db.batch();
  return db
    .collection("comments")
    .where("screamId", "==", screamId)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        batch.delete(db.doc(`/comments/${doc.id}`));
      });
      return db.collection("likes").where("screamId", "==", screamId).get();
    })
    .then((data) => {
      data.forEach((doc) => {
        batch.delete(db.doc(`/likes/${doc.id}`));
      });
      return db
        .collection("notifications")
        .where("screamId", "==", screamId)
        .get();
    })
    .then((data) => {
      data.forEach((doc) => {
        batch.delete(db.doc(`/notifications/${doc.id}`));
      });
      return batch.commit();
    })
    .catch((err) => {
      console.error(err);
      return;
    });
};
