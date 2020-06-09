const { admin, db } = require("../util/admin");
const config = require("../util/config");

// Fetch all screams of followed users and self
exports.getAllScreams = (req, res) => {
  const userDocument = db.doc(`/users/${req.user.handle}`);
  let followedByUser;
  userDocument
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(404).json({ error: "User not found" });
      followedByUser = doc.data().following;
      followedByUser.push(req.user.handle);
      if (followedByUser.length === 0) return res.json([]);
      return db
        .collection("screams")
        .where("userHandle", "in", followedByUser)
        .orderBy("createdAt", "desc")
        .get();
    })
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          ...doc.data(),
        });
      });
      return res.json(screams);
    })
    .catch((err) => {
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
    .then((doc) => {
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
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        screamData.comments.push({ commentId: doc.id, ...doc.data() });
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Post new scream
exports.postScream = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ body: "Body must not be empty" });
  if (req.body.body.length > 280)
    return res.status(400).json({ body: "Too long scream content" });
  if (req.body.tags.length > 6)
    return res.status(400).json({ tag: "Too many tags" });
  const newScream = {
    body: req.body.body.trim(),
    tags: req.body.tags,
    userHandle: req.user.handle,
    userNickname: req.user.nickname,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl,
    tags: req.body.tags,
    likeCount: 0,
    commentCount: 0,
    imageUrl: req.body.imageUrl ? req.body.imageUrl : "",
    shares: [],
  };
  db.collection("screams")
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.shareScream = (req, res) => {
  // Not validating because user cannot modify shared scream content
  const screamToShare = {
    body: req.body.body,
    tags: req.body.tags,
    userHandle: req.user.handle,
    userNickname: req.user.nickname,
    createdAt: new Date().toISOString(),
    userImage: req.body.userImage,
    tags: req.body.tags,
    likeCount: 0,
    commentCount: 0,
    imageUrl: req.body.imageUrl ? req.body.imageUrl : "",
    shares: [],
    sharedFromHandle: req.body.userHandle,
    sharedFromNickname: req.body.userNickname,
    sharedScreamId: req.body.screamId,
  };
  const resScream = screamToShare;
  db.collection("screams")
    .add(screamToShare)
    .then((doc) => {
      resScream.screamId = doc.id;
      const sharedScreamDocument = db.doc(`/screams/${req.body.screamId}`);
      return sharedScreamDocument.get();
    })
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({ error: "Scream not found" });
      return doc.ref.update({
        shares: [
          ...doc.data().shares,
          { sharedByHandle: req.user.handle, screamId: resScream.screamId },
        ],
      });
    })
    .then(() => res.json(resScream))
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

// Upload scream image
exports.uploadScreamImage = (req, res, screamId) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({ headers: req.headers });
  let imageFileName;
  let imageToBeUploaded = {};
  busboy.on("file", (fieldname, file, filename, ecoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png")
      return res.status(400).json({ error: "Wrong file type submitted" });
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket(config.storageBucket)
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        res.json({ message: "Image uploaded successfully", imageUrl });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

//Delete a scream
exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({ error: "Scream not found" });
      if (doc.data().userHandle !== req.user.handle)
        return res.status(403).json({ error: "Unauthorized" });
      const sharedScreamId = doc.data().sharedScreamId;
      if (!sharedScreamId) return document.delete();
      document.delete();
      const sharedScreamDocument = db.doc(`/screams/${sharedScreamId}`);
      return sharedScreamDocument.get();
    })
    .then((doc) => {
      if (!doc.exists)
        return res.json({ message: "Scream deleted successfully" });
      doc.ref.update({
        shares: [
          ...doc
            .data()
            .shares.filter((share) => share.screamId !== req.params.screamId),
        ],
      });
      return res.json({ message: "Scream deleted successfully" });
    })
    .catch((err) => {
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
    userImage: req.user.imageUrl,
    userNickname: req.user.nickname,
  };
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({ error: "Scream not found" });
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => db.collection("comments").add(newComment))
    .then((docRef) => {
      newComment.commentId = docRef.id;
      return res.json(newComment);
    })
    .catch((err) => {
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
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({ error: "Comment not found" });
      if (doc.data().userHandle !== req.user.handle)
        return res.status(403).json({ error: "Unauthorized" });
      return commentDocument.delete();
    })
    .then(() => screamDocument.get())
    .then((doc) => {
      return doc.ref.update({ commentCount: doc.data().commentCount - 1 });
    })
    .then(() => res.json({ message: "Scream deleted successfully" }))
    .catch((err) => {
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
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else return res.status(404).json({ error: "Scream not found" });
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle,
            createdAt: new Date().toISOString(),
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => res.json(screamData));
      } else return res.status(400).json({ error: "Scream already liked" });
    })
    .catch((err) => {
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
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else return res.status(404).json({ error: "Scream not found" });
    })
    .then((data) => {
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
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Search for screams by tag
exports.searchForScreams = (req, res) => {
  const tagToSearch = req.params.tag.toLowerCase();
  const searchedScreams = [];
  db.collection("screams")
    .where("tags", "array-contains", tagToSearch)
    .get()
    .then((data) => {
      data.forEach((doc) =>
        searchedScreams.push({
          screamId: doc.id,
          ...doc.data(),
        })
      );
      res.json(searchedScreams);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
