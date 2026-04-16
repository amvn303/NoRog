// ============================================================
// History Controller — Returns recent history entries
// ============================================================

import { getPredictionHistory } from "../services/historyService.js";

export const fetchHistory = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const { userId, profileId } = req.query;
  if (!userId || !profileId) {
    return res.status(400).json({
      success: false,
      error: "userId and profileId are required."
    });
  }

  return res.json({
    success: true,
    data: await getPredictionHistory({ userId, profileId, limit })
  });
};
