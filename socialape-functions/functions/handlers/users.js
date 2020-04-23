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

// User sign up
exports.signup = (req, res) => {
  const newUser = {
    ...req.body,
  };
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);
  const noImg = "no-image.png";
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists)
        return res.status(400).json({ handle: "This handle is already taken" });
      else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return admin.auth().createCustomToken(userId);
    })
    .then((customToken) => {
      return firebase.auth().signInWithCustomToken(customToken);
    })
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        ...newUser,
        createdAt: new Date().toISOString(),
        userId,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        followers: [],
        following: [],
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => res.status(201).json({ token }))
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        return res.status(400).json({ email: "Email is already in use" });
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
};

// User log in
exports.login = (req, res) => {
  const user = {
    ...req.body,
  };
  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => data.user.getIdToken())
    .then((token) => res.json({ token }))
    .catch((err) => {
      console.error(err);
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

// Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => res.json({ message: "Details added successfully" }))
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Get any user's details
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("screams")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      }
      return res.json(404).json({ error: "User not found" });
    })
    .then((data) => {
      userData.screams = [];
      data.forEach((doc) =>
        userData.screams.push({
          ...doc.data(),
          screamId: doc.id,
        })
      );
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => userData.likes.push(doc.data()));
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(100)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) =>
        userData.notifications.push({
          ...doc.data(),
          notificationId: doc.id,
        })
      );
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
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
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => res.json({ message: "Image uploaded successfully" }))
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

// Mark notifications read
exports.markNotificationsRead = (req, res) => {
  const batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => res.json({ message: "Notifications marked read" }))
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Follow a user
exports.follow = (req, res) => {
  const userHandle = req.user.handle;
  const userToFollow = req.params.handle;
  const userToFollowDoc = db.doc(`/users/${userToFollow}`);
  const userDocument = db.doc(`/users/${userHandle}`);
  let userData;
  if (userToFollow === userHandle)
    return res.status(400).json({ error: "Cannot follow the user" });
  userToFollowDoc
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(404).json({ error: "User not found" });
      else {
        const userToFollowData = doc.data();
        if (userToFollowData.followers.includes(userHandle))
          return res.json(400).json({ error: "User already followed" });
        userToFollowData.followers.push(userHandle);
        return userToFollowDoc.update({
          followers: [...userToFollowData.followers],
        });
      }
    })
    .then(() => userDocument.get())
    .then((doc) => {
      userData = doc.data();
      userData.following.push(userToFollow);
      return userDocument.update({ following: [...userData.following] });
    })
    .then(() => res.json(userData))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Unfollow a user
exports.unfollow = (req, res) => {
  const userHandle = req.user.handle;
  const userToUnfollow = req.params.handle;
  const userToUnfollowDoc = db.doc(`/users/${userToUnfollow}`);
  const userDocument = db.doc(`/users/${userHandle}`);
  let userData;
  userToUnfollowDoc
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(404).json({ error: "User not found" });
      else {
        const userToUnfollowData = doc.data();
        if (!userToUnfollowData.followers.includes(userHandle))
          return res.status(400).json({ error: "User not followed" });
        userToUnfollowData.followers = userToUnfollowData.followers.filter(
          (handle) => handle !== userHandle
        );
        return userToUnfollowDoc.update({
          followers: [...userToUnfollowData.followers],
        });
      }
    })
    .then(() => userDocument.get())
    .then((doc) => {
      userData = doc.data();
      userData.following = userData.following.filter(
        (handle) => handle !== userToUnfollow
      );
      return userDocument.update({ following: [...userData.following] });
    })
    .then(() => res.json(userData))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Get followers detais
exports.getFollowUsersDetails = (req, res, type) => {
  const userHandle = req.params.handle;
  const userDocument = db.doc(`/users/${userHandle}`);
  let followUsersHandles;
  let followUsersDetails = [];
  userDocument
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(404).json({ error: "User not found" });
      followUsersHandles =
        type === "followers" ? doc.data().followers : doc.data().following;
      if (followUsersHandles.length === 0) return res.json([]);
      return db
        .collection("users")
        .where("handle", "in", followUsersHandles)
        .get();
    })
    .then((data) => {
      data.forEach((doc) => followUsersDetails.push(doc.data()));
      res.json(followUsersDetails);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Search for a user by name
exports.searchForUser = (req, res) => {
  const nameToSearch = req.params.name.toLowerCase();
  const searchedUsers = [];
  db.collection("users")
    .get()
    .then((data) => {
      data.forEach((doc) => {
        if (
          doc.data().handle.toLowerCase().includes(nameToSearch) ||
          doc.data().nickname.toLowerCase().includes(nameToSearch)
        )
          searchedUsers.push(doc.data());
      });
      res.json(searchedUsers);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Change user's password
exports.changePassword = (req, res) => {
  const user = firebase.auth().currentUser;
  const { oldPassword, newPassword } = req.body;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    oldPassword
  );
  user
    .reauthenticateWithCredential(credentials)
    .then(() => {
      const { valid, errors } = validatePasswordChangeData(req.body);
      if (!valid) return res.status(400).json(errors);
      user
        .updatePassword(newPassword)
        .then(() => res.status(200).json({ success: "success" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password")
        return res.status(400).json({ password: "Wrong password" });
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
};

// Send password reset email
exports.sendPasswordResetEmail = (req, res) => {
  const email = req.body.email;
  db.collection("users")
    .where("email", "==", email)
    .get()
    .then(() =>
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => res.status(200).json({ success: "success" }))
    )
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/user-not-found")
        return res.status(400).json({ email: "User not found" });
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
};
