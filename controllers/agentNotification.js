import { db } from "../config/firebase.js";

export const agentNotification = async (req, res) => {
  try {
    const { agentId, fcmToken } = req.body;

    if (!agentId || !fcmToken) {
      return res.status(400).json({ error: "agentId and fcmToken required" });
    }

    await db.collection("agents").doc(agentId).set(
      {
        fcmToken,
        updatedAt: Date.now(),
      },
      { merge: true },
    );

    res.json({
      success: true,
      message: "FCM token saved",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save token" });
  }
};
