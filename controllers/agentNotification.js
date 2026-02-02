import admin from "firebase-admin"; // Ensure firebase-admin is setup
import { db } from "../config/firebase.js";

const agentNotification = async (req, res) => {
  try {
    const { agentId, clientId, clientName, propertyType } = req.body;

    // 1. Find the Agent's token in the DB
    const agentDoc = await db.collection("agents").doc(agentId).get();

    if (!agentDoc.exists || !agentDoc.data().pushToken) {
      return res
        .status(404)
        .json({ error: "Agent not found or has no push token" });
    }

    const agentToken = agentDoc.data().pushToken;

    // 2. Prepare the Notification Payload for Notifee
    const message = {
      token: agentToken,
      notification: {
        title: "New Booking Request! 🏠",
        body: `${clientName} wants to book a ${propertyType} viewing.`,
      },
      android: {
        priority: "high",
        notification: {
          channelId: "default", // Must match the Notifee channel ID
        },
      },
      data: {
        type: "BOOKING_REQUEST",
        clientId: clientId,
      },
    };

    // 3. Send via Firebase Admin SDK
    await admin.messaging().send(message);

    res.json({ success: true, message: "Request sent and Agent notified!" });
  } catch (err) {
    console.error("FCM Send Error:", err);
    res.status(500).json({ error: "Failed to process booking" });
  }
};

export default agentNotification;