const { db } = require("./util/admin");

// Create notification on like handler
exports.handleCreateNotificationOnLike = snapshot =>
  db
    .doc(`/screams/${snapshot.data().screamId}`)
    .get()
    .then(doc => {
      if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "like",
          read: false,
          screamId: doc.id
        });
      }
    })
    .catch(err => {
      console.error(err);
      return;
    });

// Delete notification on unlike handler
exports.handleDeleteNotificationOnUnlike = snapshot => {
  return db
    .doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch(err => {
      console.error(err);
      return;
    });
};

// Create notification on comment handler
exports.handleCreateNotificationOnComment = snapshot => {
  return db
    .doc(`/screams/${snapshot.data().screamId}`)
    .get()
    .then(doc => {
      if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "comment",
          read: false,
          screamId: doc.id
        });
      }
    })
    .catch(err => {
      console.error(err);
      return;
    });
};

// Delete notification on comment delete handler
exports.handleDeleteNotificationOnCommentDelete = snapshot => {
  return db
    .doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch(err => {
      console.error(err);
      return;
    });
};

// Create notification on follow handler
exports.handleCreateNotificationOnFollow = change => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const newFollower = dataAfter.followers.filter(
    follower => !dataBefore.followers.includes(follower)
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
        read: false
      })
      .catch(err => {
        console.error(err);
        return;
      });
  }
  return null;
};

exports.handleDeleteNotificationOnUnfollow = change => {
  const dataBefore = change.before.data();
  const dataAfter = change.after.data();
  const unfollower = dataBefore.followers.filter(
    follower => !dataAfter.followers.includes(follower)
  );
  if (unfollower.length > 0) {
    const notificationId = dataBefore.userId + unfollower[0];
    return db
      .doc(`/notifications/${notificationId}`)
      .delete()
      .catch(err => {
        console.error(err);
        return;
      });
  }
  return null;
};

// Handle user image change
exports.handleOnUserImageChange = change => {
  if (change.before.data().imageUrl !== change.after.data().imageUrl) {
    const batch = db.batch();
    return db
      .collection("screams")
      .where("userHandle", "==", change.before.data().handle)
      .get()
      .then(data => {
        data.forEach(doc => {
          const scream = db.doc(`/screams/${doc.id}`);
          batch.update(scream, { userImage: change.after.data().imageUrl });
        });
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
        return;
      });
  } else return true;
};

// Handle deleting scream handler
exports.handleOnScreamDelete = (snapshot, context) => {
  const screamId = context.params.screamId;
  const batch = db.batch();
  return db
    .collection("comments")
    .where("screamId", "==", screamId)
    .get()
    .then(data => {
      data.forEach(doc => {
        batch.delete(db.doc(`/comments/${doc.id}`));
      });
      return db
        .collection("likes")
        .where("screamId", "==", screamId)
        .get();
    })
    .then(data => {
      data.forEach(doc => {
        batch.delete(db.doc(`/likes/${doc.id}`));
      });
      return db
        .collection("notifications")
        .where("screamId", "==", screamId)
        .get();
    })
    .then(data => {
      data.forEach(doc => {
        batch.delete(db.doc(`/notifications/${doc.id}`));
      });
      return batch.commit();
    })
    .catch(err => {
      console.error(err);
      return;
    });
};
