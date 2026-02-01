import admin from "firebase-admin";
import fs from "fs";
import "dotenv/config";

const serviceAccount = JSON.parse(fs.readFileSync(new URL("./firebase-adminsdk.json", import.meta.url), "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});


// Initialize Firestore and Storage Bucket
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Export named instances
export { admin, db, bucket };

