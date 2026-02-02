import { db } from "../config/firebase.js";
import { sendPushNotification } from "../utils/push.js";

export const clinetRequest = async (req, res) => {
  try {
    const { agentId, clientId, clientName, propertyType, lat, lng } = req.body;

    // 1️⃣ Validation - Check inputs immediately
    if (!agentId || !clientId || !propertyType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2️⃣ Create the Request in Firestore FIRST
    // We do this first so we have a docRef.id to send in the notification
    const docRef = await db.collection("agent_requests").add({
      agentId,
      clientId,
      clientName,
      propertyType,
      lat: Number(lat),
      lng: Number(lng),
      status: "pending",
      createdAt: Date.now(),
    });

    console.log(`✅ Request created: ${docRef.id}`);

    // 3️⃣ Fetch Agent Token SECOND
    const agentSnap = await db.collection("agents").doc(agentId).get();

    // Check both possible field names based on your previous logs
    const fcmToken = agentSnap.exists
      ? agentSnap.data().fcmToken || agentSnap.data().pushToken
      : null;

    // 4️⃣ Send Notification THIRD (Now fcmToken is defined!)
    if (fcmToken) {
      try {
        await sendPushNotification(fcmToken, {
          title: "New Client 🚨",
          body: `${clientName} needs a ${propertyType}`,
          data: {
            requestId: String(docRef.id),
            lat: String(lat),
            lng: String(lng),
            type: "NEW_BOOKING_REQUEST",
          },
        });
      } catch (pushError) {
        // Log push error but don't crash the response
        console.error("⚠️ Push failed:", pushError.message);
      }
    }

    // 5️⃣ Send success response
    res.status(201).json({
      success: true,
      requestId: docRef.id,
    });
  } catch (error) {
    console.error("❌ Controller Error:", error);
    res.status(500).json({ error: "Failed to create request" });
  }
};
