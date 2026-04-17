import { Router } from "express";
import User from "../models/User.js";
import HealthProfile from "../models/HealthProfile.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

// GET /api/profile — get user's health profile
router.get("/", async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id).select("-password");
    
    if (!profile) {
      return res.status(404).json({ success: false, error: "Profile not found" });
    }

    res.json({ success: true, data: { user, profile } });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
});

// POST /api/profile — create or update full health profile (onboarding)
router.post("/", async (req, res) => {
  try {
    const {
      age, gender, location,
      currentSymptoms, medicalHistory, familyHistory,
      lifestyle, medicines
    } = req.body;

    // Update user demographics
    await User.findByIdAndUpdate(req.user.id, {
      ...(age && { age }),
      ...(gender && { gender }),
      ...(location && { location })
    });

    // Update health profile
    const profile = await HealthProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        currentSymptoms: currentSymptoms || [],
        medicalHistory: medicalHistory || [],
        familyHistory: familyHistory || [],
        lifestyle: lifestyle || {},
        medicines: medicines || [],
        onboardingComplete: true
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
});

// PUT /api/profile/medicines — update medicines list
router.put("/medicines", async (req, res) => {
  try {
    const { medicines } = req.body;

    const profile = await HealthProfile.findOneAndUpdate(
      { userId: req.user.id },
      { medicines: medicines || [] },
      { new: true }
    );

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error("Update medicines error:", error);
    res.status(500).json({ success: false, error: "Failed to update medicines" });
  }
});

export default router;
