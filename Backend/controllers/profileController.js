// ============================================================
// Profile Controller — Generates aggregated health profile
// ============================================================

import { getProfile } from "../services/profileService.js";
import { createFamilyProfile, ensureUserWithDefaultProfile, listProfiles } from "../services/userService.js";

export const bootstrapUser = async (req, res) => {
  const { externalId, name } = req.body;
  if (!externalId) {
    return res.status(400).json({
      success: false,
      error: "externalId is required."
    });
  }
  try {
    const { user, profiles } = await ensureUserWithDefaultProfile({ externalId, name });
    return res.json({
      success: true,
      data: {
        user: { id: String(user._id), externalId: user.externalId, name: user.name },
        profiles: profiles.map((p) => ({
          id: String(p._id),
          label: p.label,
          displayName: p.displayName,
          age: p.age ?? null
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to bootstrap user context." });
  }
};

export const createProfile = async (req, res) => {
  const { userId, label, displayName, age, habits, lifestyle, pastConditions } = req.body;
  if (!userId || !displayName) {
    return res.status(400).json({
      success: false,
      error: "userId and displayName are required."
    });
  }
  try {
    const profile = await createFamilyProfile({
      userId,
      label,
      displayName,
      age,
      habits,
      lifestyle,
      pastConditions
    });
    return res.status(201).json({
      success: true,
      data: {
        id: String(profile._id),
        label: profile.label,
        displayName: profile.displayName,
        age: profile.age ?? null
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to create family profile." });
  }
};

export const fetchProfiles = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "userId is required."
    });
  }
  try {
    const profiles = await listProfiles(userId);
    return res.json({
      success: true,
      data: profiles.map((p) => ({
        id: String(p._id),
        label: p.label,
        displayName: p.displayName,
        age: p.age ?? null
      }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch profiles." });
  }
};

export const fetchProfile = async (req, res) => {
  const { userId, profileId } = req.query;
  if (!userId || !profileId) {
    return res.status(400).json({
      success: false,
      error: "userId and profileId are required."
    });
  }

  try {
    const profile = await getProfile({ userId, profileId });

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
