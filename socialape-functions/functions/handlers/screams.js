const { admin, db } = require("../util/admin");
const config = require("../util/config");

// Fetch all screams of followed users and self
exports.getAllScreams = async (req, res) => {
  const userDocument = db.doc(`/users/${req.user.handle}`);
  try {
    const doc = await userDocument.get();
    if (!doc.exists) return res.status(404).json({ error: "User not found" });
    const followedByUser = doc.data().following;
    followedByUser.push(req.user.handle);
    if (followedByUser.length === 0) return res.json([]);
    const data = await db
      .collection("screams")
      .where("userHandle", "in", followedByUser)
      .orderBy("createdAt", "desc")
      .get();
    let screams = [];
    data.forEach((doc) => {
      screams.push({
        screamId: doc.id,
        ...doc.data(),
      });
    });
    return res.json(screams);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Fetch one scream
exports.getScream = async (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  try {
    const doc = await document.get();
    if (!doc.exists) return res.status(404).json({ error: "Scream not found" });
    const screamData = doc.data();
    screamData.screamId = doc.id;
    const data = await db
      .collection("comments")
      .orderBy("createdAt", "desc")
      .where("screamId", "==", req.params.screamId)
      .get();
    screamData.comments = [];
    data.forEach((doc) => {
      screamData.comments.push({ commentId: doc.id, ...doc.data() });
    });
    return res.json(screamData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Post new scream
exports.postScream = async (req, res) => {
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
    replies: [],
    sharedFromHandle: null,
    sharedFromNickname: null,
    sharedScreamId: null,
    replyToHandle: null,
    replyToNickname: null,
    repliedScreamId: null,
    repliedScreamBody: null,
  };
  try {
    const doc = await db.collection("screams").add(newScream);
    const responseScream = newScream;
    responseScream.screamId = doc.id;
    return res.json(responseScream);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.shareScream = async (req, res) => {
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
    replies: [],
    sharedFromHandle: req.body.userHandle,
    sharedFromNickname: req.body.userNickname,
    sharedScreamId: req.body.screamId,
    replyToHandle: req.body.replyToHandle ? req.body.replyToHandle : null,
    replyToNickname: req.body.replyToNickname ? req.body.replyToNickname : null,
    repliedScreamId: req.body.repliedScreamId ? req.body.repliedScreamId : null,
    repliedScreamBody: req.body.repliedScreamBody
      ? req.body.repliedScreamBody
      : null,
  };
  const responseScream = screamToShare;
  try {
    let doc = await db.collection("screams").add(screamToShare);
    responseScream.screamId = doc.id;
    const sharedScreamDocument = db.doc(`/screams/${req.body.screamId}`);
    doc = await sharedScreamDocument.get();
    if (!doc.exists) return res.status(404).json({ error: "Scream not found" });
    await doc.ref.update({
      shares: [
        ...doc.data().shares,
        {
          sharedByHandle: req.user.handle,
          screamId: responseScream.screamId,
        },
      ],
    });
    return res.json(responseScream);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Reply to scream
exports.replyToScream = async (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ body: "Body must not be empty" });
  if (req.body.body.length > 280)
    return res.status(400).json({ body: "Too long scream content" });
  if (req.body.tags.length > 6)
    return res.status(400).json({ tag: "Too many tags" });
  const newReply = {
    body: req.body.body,
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
    replies: [],
    replyToHandle: req.body.replyScreamData.userHandle,
    replyToNickname: req.body.replyScreamData.userNickname,
    repliedScreamId: req.body.replyScreamData.screamId,
    repliedScreamBody: req.body.replyScreamData.body,
    sharedFromHandle: null,
    sharedFromNickname: null,
    sharedScreamId: null,
  };
  const responseScream = newReply;
  try {
    let doc = await db.collection("screams").add(newReply);
    responseScream.screamId = doc.id;
    const repliedScreamDocument = db.doc(
      `/screams/${req.body.replyScreamData.screamId}`
    );
    doc = await repliedScreamDocument.get();
    if (!doc.exists) return res.status(404).json({ error: "Scream not found" });
    await doc.ref.update({
      replies: [
        ...doc.data().replies,
        {
          replyFromHandle: req.user.handle,
          screamId: responseScream.screamId,
        },
      ],
    });
    return res.json(responseScream);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
    console.error(err);
  }
};

// Upload scream image
exports.uploadScreamImage = (req, res) => {
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
  busboy.on("finish", async () => {
    try {
      await admin
        .storage()
        .bucket(config.storageBucket)
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,
            },
          },
        });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
      return res.json({ message: "Image uploaded successfully", imageUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }
  });
  busboy.end(req.rawBody);
};

//Delete a scream
exports.deleteScream = async (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  try {
    let doc = await document.get();
    if (!doc.exists) return res.status(404).json({ error: "Scream not found" });
    if (doc.data().userHandle !== req.user.handle)
      return res.status(403).json({ error: "Unauthorized" });
    const sharedScreamId = doc.data().sharedScreamId;
    const repliedScreamId = doc.data().repliedScreamId;
    document.delete();
    if (!sharedScreamId && !repliedScreamId)
      return res.json({ message: "Scream deleted successfully" });
    if (sharedScreamId) {
      const sharedScreamDocument = db.doc(`/screams/${sharedScreamId}`);
      doc = await sharedScreamDocument.get();
    }
    if (repliedScreamId) {
      const repliedScreamDocument = db.doc(`/screams/${repliedScreamId}`);
      doc = await repliedScreamDocument.get();
    }
    if (!doc.exists)
      return res.json({ message: "Scream deleted successfully" });
    await doc.ref.update({
      shares: [
        ...doc
          .data()
          .shares.filter((share) => share.screamId !== req.params.screamId),
      ],
    });
    await doc.ref.update({
      replies: [
        ...doc
          .data()
          .replies.filter((reply) => reply.screamId !== req.params.screamId),
      ],
    });
    return res.json({ message: "Scream deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Comment on a scream
exports.commentOnScream = async (req, res) => {
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
  try {
    const doc = await document.get();
    if (!doc.exists) return res.status(404).json({ error: "Scream not found" });
    await doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    const docRef = await db.collection("comments").add(newComment);
    newComment.commentId = docRef.id;
    return res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const commentDocument = db.doc(`/comments/${req.params.commentId}`);
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  try {
    let doc = await commentDocument.get();
    if (!doc.exists)
      return res.status(404).json({ error: "Comment not found" });
    if (doc.data().userHandle !== req.user.handle)
      return res.status(403).json({ error: "Unauthorized" });
    await commentDocument.delete();
    doc = await screamDocument.get();
    await doc.ref.update({ commentCount: doc.data().commentCount - 1 });
    return res.json({ message: "Scream deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Like a scream
exports.likeScream = async (req, res) => {
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);
  try {
    const doc = await screamDocument.get();
    if (!doc.exists) return res.status(404).json({ error: "Scream not found" });
    const screamData = doc.data();
    screamData.screamId = doc.id;
    const likeData = await likeDocument.get();
    if (likeData.empty) {
      await db.collection("likes").add({
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
      });
      screamData.likeCount++;
      await screamDocument.update({ likeCount: screamData.likeCount });
      return res.json(screamData);
    } else return res.status(400).json({ error: "Scream already liked" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Unlike a scream
exports.unlikeScream = async (req, res) => {
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);
  try {
    const doc = await screamDocument.get();
    if (!doc.exists) return res.status(404).json({ error: "Scream not found" });
    const screamData = doc.data();
    screamData.screamId = doc.id;
    const likeData = await likeDocument.get();
    if (likeData.empty) {
      return res.status(400).json({ error: "Scream not liked" });
    } else {
      await db.doc(`/likes/${likeData.docs[0].id}`).delete();
      screamData.likeCount--;
      await screamDocument.update({ likeCount: screamData.likeCount });
      return res.json(screamData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};

// Search for screams by tag
exports.searchForScreams = async (req, res) => {
  const tagToSearch = req.params.tag.toLowerCase();
  const searchedScreams = [];
  try {
    const data = await db
      .collection("screams")
      .where("tags", "array-contains", tagToSearch)
      .get();
    data.forEach((doc) =>
      searchedScreams.push({
        screamId: doc.id,
        ...doc.data(),
      })
    );
    return res.json(searchedScreams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.code });
  }
};
