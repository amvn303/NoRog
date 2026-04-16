// ============================================================
// Profile Controller — Generates aggregated health profile
// ============================================================

import { getProfile } from "../services/profileService.js";

export const fetchProfile = (req, res) => {
  try {
    const profile = getProfile();

    return res.json({
      success: true,
      data: profile,
      disclaimer: "This profile is based on self-reported data and behavioral pattern analysis, not clinical assessment."
    });
  } catch (error) {
    console.error("GET /api/profile error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while generating profile."
    });
  }
};
