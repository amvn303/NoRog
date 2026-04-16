import { getChatSession, processChatMessage } from "../services/chatService.js";

export const getChat = async (req, res) => {
  const { userId, profileId } = req.query;
  if (!userId || !profileId) {
    return res.status(400).json({
      success: false,
      error: "userId and profileId are required."
    });
  }
  try {
    const data = await getChatSession({ userId, profileId });
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to load chat context." });
  }
};

export const postChatMessage = async (req, res) => {
  const { userId, profileId, text } = req.body;
  if (!userId || !profileId || !text) {
    return res.status(400).json({
      success: false,
      error: "userId, profileId and text are required."
    });
  }
  try {
    const data = await processChatMessage({ userId, profileId, text });
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to process chat message." });
  }
};

