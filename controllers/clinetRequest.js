import { db } from "../config/firebase.js";
import { sendPushNotification } from "../utils/push.js";

export const clinetRequest = async (req, res) => {
  try {
    const { agentId, clientId, clientName, propertyType, lat, lng } = req.body;

    if (!agentId || !clientId || !propertyType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const docRef = await db.collection("agent_requests").add({
      agentId,
      clientId,
      clientName,
      propertyType,
      lat,
      lng,
      status: "pending",
      createdAt: Date.now(),
    });

    // 🔔 Fetch agent FCM token
    const agentSnap = await db.collection("agents").doc(agentId).get();
    const fcmToken = agentSnap.exists ? agentSnap.data().fcmToken : null;

    if (fcmToken) {
      await sendPushNotification(fcmToken, {
        title: "New Client 🚨",
        body: `${clientName} needs a ${propertyType}`,
        data: {
          requestId: docRef.id,
          lat: String(lat),
          lng: String(lng),
        },
      });
    }

    res.status(201).json({
      success: true,
      requestId: docRef.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create request" });
  }
};
