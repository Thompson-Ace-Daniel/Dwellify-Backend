import { admin } from "../config/firebase.js";

/**
 * Sends a push notification to a specific device.
 * @param {string} fcmToken - The target device token.
 * @param {object} payload - Title, body, and extra data.
 */
export const sendPushNotification = async (fcmToken, { title, body, data }) => {
  try {
    const message = {
      token: fcmToken,
      notification: {
        title: title || "New Notification",
        body: body || "",
      },
      // Android specific settings for Notifee
      android: {
        priority: "high",
        notification: {
          channelId: "default", // Must match the channel created in your RN app
          clickAction: "TOP_LEVEL_ACTION", // Important for triggering tap events
        },
      },
      // Data payload for navigation (requestId, coordinates, etc.)
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    console.log("🚀 Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
    throw error;
  }
};
