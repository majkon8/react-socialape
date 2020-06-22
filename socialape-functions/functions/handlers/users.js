const { admin, db } = require("../util/admin");
const firebase = require("firebase");
const config = require("../util/config");
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
  validatePasswordChangeData,
} = require("../util/validators");
firebase.initializeApp(config);

// Refresh token
exports.refreshToken = async (req, res) => {
  const user = firebase.auth().currentUser;
  try {
    const token = await user.getIdToken(true);
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// User sign up
exports.signup = async (req, res) => {
  const newUser = {
    ...req.body,
  };
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);
  const noImg = "no-image.png";
  try {
    const doc = await db.doc(`/users/${newUser.handle}`).get();
    if (doc.exists)
      return res.status(400).json({ handle: "This handle is already taken" });
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);
    await firebase
      .auth()
      .signInWithEmailAndPassword(newUser.email, newUser.password);
    const userId = data.user.uid;
    const token = await data.user.getIdToken();
    const refreshToken = data.user.refreshToken;
    const userCredentials = {
      ...newUser,
      createdAt: new Date().toISOString(),
      userId,
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
      followers: [],
      following: [],
    };
    await db.doc(`/users/${newUser.handle}`).set(userCredentials);
    const email = newUser.email;
    const password = newUser.password;
    return res.status(201).json({ token, email, password, refreshToken });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/email-already-in-use")
      return res.status(400).json({ email: "Email is already in use" });
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

// User log in
exports.login = async (req, res) => {
  const user = {
    ...req.body,
  };
  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);
  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
    const token = await data.user.getIdToken();
    const refreshToken = data.user.refreshToken;
    const email = user.email;
    const password = user.password;
    const userCredentials = { token, email, password, refreshToken };
    return res.json(userCredentials);
  } catch (err) {
    console.error(err);
    return res
      .status(403)
      .json({ general: "Wrong credentials, please try again" });
  }
};

// change user details
exports.changeUserDetails = async (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  try {
    await db.doc(`/users/${req.user.handle}`).update(userDetails);
    return res.json({ message: "Details added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Get any user's details
exports.getUserDetails = async (req, res) => {
  let userData = {};
  try {
    const doc = await db.doc(`/users/${req.params.handle}`).get();
    if (!doc.exists) return res.json(404).json({ error: "User not found" });
    userData.user = doc.data();
    const data = await db
      .collection("screams")
      .where("userHandle", "==", req.params.handle)
      .orderBy("createdAt", "desc")
      .get();
    userData.screams = [];
    data.forEach((doc) =>
      userData.screams.push({
        ...doc.data(),
        screamId: doc.id,
      })
    );
    return res.json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Get own user details
exports.getAuthenticatedUser = async (req, res) => {
  let userData = {};
  try {
    const doc = await db.doc(`/users/${req.user.handle}`).get();
    if (!doc.exists) return res.json(404).json({ error: "User not found" });
    userData.credentials = doc.data();
    let data = await db
      .collection("likes")
      .where("userHandle", "==", req.user.handle)
      .get();
    userData.likes = [];
    data.forEach((doc) => userData.likes.push(doc.data()));
    data = await db
      .collection("notifications")
      .where("recipient", "==", req.user.handle)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    userData.notifications = [];
    data.forEach((doc) =>
      userData.notifications.push({
        ...doc.data(),
        notificationId: doc.id,
      })
    );
    return res.json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Upload user image
exports.uploadUserImage = (req, res) => {
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
      await db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      res.json({ message: "Image uploaded successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }
  });
  busboy.end(req.rawBody);
};

// Mark notifications read
exports.markNotificationsRead = async (req, res) => {
  const batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  try {
    await batch.commit();
    return res.json({ message: "Notifications marked read" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Follow a user
exports.follow = async (req, res) => {
  const userHandle = req.user.handle;
  const userToFollow = req.params.handle;
  const userToFollowDoc = db.doc(`/users/${userToFollow}`);
  const userDocument = db.doc(`/users/${userHandle}`);
  if (userToFollow === userHandle)
    return res.status(400).json({ error: "Cannot follow the user" });
  try {
    let doc = await userToFollowDoc.get();
    if (!doc.exists) return res.status(404).json({ error: "User not found" });
    else {
      const userToFollowData = doc.data();
      if (userToFollowData.followers.includes(userHandle))
        return res.json(400).json({ error: "User already followed" });
      userToFollowData.followers.push(userHandle);
      await userToFollowDoc.update({
        followers: [...userToFollowData.followers],
      });
    }
    doc = await userDocument.get();
    const userData = doc.data();
    userData.following.push(userToFollow);
    await userDocument.update({ following: [...userData.following] });
    return res.json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Unfollow a user
exports.unfollow = async (req, res) => {
  const userHandle = req.user.handle;
  const userToUnfollow = req.params.handle;
  const userToUnfollowDoc = db.doc(`/users/${userToUnfollow}`);
  const userDocument = db.doc(`/users/${userHandle}`);
  try {
    let doc = await userToUnfollowDoc.get();
    if (!doc.exists) return res.status(404).json({ error: "User not found" });
    else {
      const userToUnfollowData = doc.data();
      if (!userToUnfollowData.followers.includes(userHandle))
        return res.status(400).json({ error: "User not followed" });
      userToUnfollowData.followers = userToUnfollowData.followers.filter(
        (handle) => handle !== userHandle
      );
      await userToUnfollowDoc.update({
        followers: [...userToUnfollowData.followers],
      });
    }
    doc = await userDocument.get();
    const userData = doc.data();
    userData.following = userData.following.filter(
      (handle) => handle !== userToUnfollow
    );
    await userDocument.update({ following: [...userData.following] });
    return res.json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Get followers detais
exports.getFollowUsersDetails = async (req, res, type) => {
  const userHandle = req.params.handle;
  const userDocument = db.doc(`/users/${userHandle}`);
  let followUsersDetails = [];
  try {
    const doc = await userDocument.get();
    if (!doc.exists) return res.status(404).json({ error: "User not found" });
    const followUsersHandles =
      type === "followers" ? doc.data().followers : doc.data().following;
    if (followUsersHandles.length === 0) return res.json([]);
    const data = await db
      .collection("users")
      .where("handle", "in", followUsersHandles)
      .get();
    data.forEach((doc) => followUsersDetails.push(doc.data()));
    return res.json(followUsersDetails);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Search for a user by name
exports.searchForUser = async (req, res) => {
  const nameToSearch = req.params.name.toLowerCase();
  const searchedUsers = [];
  try {
    const data = await db.collection("users").get();
    data.forEach((doc) => {
      if (
        doc.data().handle.toLowerCase().includes(nameToSearch) ||
        doc.data().nickname.toLowerCase().includes(nameToSearch)
      )
        searchedUsers.push(doc.data());
    });
    return res.json(searchedUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

// Change user's password
exports.changePassword = async (req, res) => {
  const user = firebase.auth().currentUser;
  const { oldPassword, newPassword } = req.body;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    oldPassword
  );
  try {
    await user.reauthenticateWithCredential(credentials);
    const { valid, errors } = validatePasswordChangeData(req.body);
    if (!valid) return res.status(400).json(errors);
    await user.updatePassword(newPassword);
    return res.status(200).json({ success: "success" });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/wrong-password")
      return res.status(400).json({ password: "Wrong password" });
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (req, res) => {
  const email = req.body.email;
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    return res.status(200).json({ success: "success" });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/user-not-found")
      return res.status(400).json({ email: "User not found" });
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};
