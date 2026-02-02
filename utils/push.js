import { admin } from "../config/firebase.js";

export const sendPushNotification = async (fcmToken, payload) => {
  if (!fcmToken) return;

  const message = {
    token: fcmToken,
    android: {
      priority: "high",
    },
    data: {
      title: payload.title,
      body: payload.body,
      ...(payload.data || {}),
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Push sent:", response);
    return response;
  } catch (err) {
    console.error("❌ Push failed:", err.message);
    throw err;
  }
};
