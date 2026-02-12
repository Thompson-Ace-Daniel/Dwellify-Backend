import { admin } from "../config/firebase.js";
import fetch from "node-fetch"; // Ensure you have node-fetch installed

export const sendPushNotification = async (token, { title, body, data }) => {
  // Check if it is an Expo Token
  if (token.startsWith("ExponentPushToken")) {
    return await sendExpoNotification(token, { title, body, data });
  }

  // Otherwise, treat it as a native FCM token
  return await sendFCMNotification(token, { title, body, data });
};

// --- PRIVATE HELPERS ---

async function sendExpoNotification(token, { title, body, data }) {
  console.log("📤 Sending via Expo Service...");
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      to: token,
      title,
      body,
      data, // Expo automatically flattens this
      sound: "default",
    }),
  });
  const result = await response.json();
  console.log("✅ Expo Response:", result);
  return result;
}

async function sendFCMNotification(fcmToken, { title, body, data }) {
  console.log("📤 Sending via FCM...");
  const message = {
    token: fcmToken,
    notification: { title, body },
    android: {
      priority: "high",
      notification: {
        channelId: "default",
      },
    },
    data: data || {},
  };
  return await admin.messaging().send(message);
}
