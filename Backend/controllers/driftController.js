// ============================================================
// Drift Controller — Detects health trend patterns
// ============================================================

import { detectDrift } from "../services/driftService.js";

export const fetchDrift = async (req, res) => {
  const { userId, profileId } = req.query;
  if (!userId || !profileId) {
    return res.status(400).json({
      success: false,
      error: "userId and profileId are required."
    });
  }

  try {
    const drift = await detectDrift({ userId, profileId });

    return res.json({
      success: true,
      data: drift
    });
  } catch (error) {
    console.error("GET /api/drift error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong during drift detection."
    });
  }
};
