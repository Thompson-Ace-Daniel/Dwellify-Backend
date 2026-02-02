import { db } from "../config/firebase.js";

export const agentNotification = async (req, res) => {
  try {
    const { agentId, pushToken } = req.body;

    if (!agentId || !pushToken) {
      return res.status(400).json({ error: "agentId and pushToken required" });
    }

    await db.collection("agents").doc(agentId).set(
      {
        pushToken,
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
