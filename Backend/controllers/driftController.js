// ============================================================
// Drift Controller — Detects health trend patterns
// ============================================================

import { detectDrift } from "../services/driftService.js";

export const fetchDrift = (req, res) => {
  try {
    const drift = detectDrift();

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
