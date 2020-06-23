const admin = require("firebase-admin");
const serviceAccount = require("../key");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialape-98946.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
