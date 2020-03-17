const { db } = require("../util/admin");

// Fetch all screams of followed users
exports.getAllScreams = (req, res) => {
  const userDocument = db.doc(`/users/${req.user.handle}`);
  let followedByUser;
  userDocument
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "User not found" });
      followedByUser = doc.data().following;
      if (followedByUser.length === 0) return res.json([]);
      return db
        .collection("screams")
        .where("userHandle", "in", followedByUser)
        .orderBy("createdAt", "desc")
        .get();
    })
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...doc.data()
        });
      });
      return res.json(screams);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Fetch one scream
exports.getScream = (req, res) => {
  let screamData = {};
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: "Scream not found" });
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then(data => {
      screamData.comments = [];
      data.forEach(doc => {
        screamData.comments.push({ commentId: doc.id, ...doc.data() });
      });
      return res.json(screamData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Post new scream
exports.postOneScream = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ body: "Body must not be empty" });
  if (req.body.body.length > 280)
    return res.status(400).json({ body: "Too long scream content" });
  const newScream = {
    body: req.body.body.trim(),
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0
  };
  db.collection("screams")
    .add(newScream)
    .then(doc => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

//Delete a scream
exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: "Scream not found" });
      if (doc.data().userHandle !== req.user.handle)
        return res.status(403).json({ error: "Unauthorized" });
      return document.delete();
    })
    .then(() => res.json({ message: "Scream deleted successfully" }))
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Comment on a scream
exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: "Scream not found" });
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => db.collection("comments").add(newComment))
    .then(docRef => {
      newComment.commentId = docRef.id;
      return res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

// Delete a comment
exports.deleteComment = (req, res) => {
  const commentDocument = db.doc(`/comments/${req.params.commentId}`);
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  commentDocument
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: "Comment not found" });
      if (doc.data().userHandle !== req.user.handle)
        return res.status(403).json({ error: "Unauthorized" });
      return commentDocument.delete();
    })
    .then(() => screamDocument.get())
    .then(doc => {
      return doc.ref.update({ commentCount: doc.data().commentCount - 1 });
    })
    .then(() => res.json({ message: "Scream deleted successfully" }))
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Like a scream
exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  let screamData;
  screamDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else return res.status(404).json({ error: "Scream not found" });
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle,
            createdAt: new Date().toISOString()
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => res.json(screamData));
      } else return res.status(400).json({ error: "Scream already liked" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Unlike a scream
exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  let screamData;
  screamDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else return res.status(404).json({ error: "Scream not found" });
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: "Scream not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => res.json(screamData));
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
