import User from "../models/User.js";
import HealthProfile from "../models/HealthProfile.js";

export const ensureUserWithDefaultProfile = async ({ externalId, name = "Guest User" }) => {
  let user = await User.findOne({ externalId });
  if (!user) {
    user = await User.create({ externalId, name, profiles: [] });
  }

  let profiles = await HealthProfile.find({ userId: user._id }).sort({ createdAt: 1 });
  if (profiles.length === 0) {
    const selfProfile = await HealthProfile.create({
      userId: user._id,
      label: "self",
      displayName: user.name || "Self"
    });
    user.profiles.push(selfProfile._id);
    await user.save();
    profiles = [selfProfile];
  }

  return { user, profiles };
};

export const createFamilyProfile = async ({ userId, label, displayName, age, habits, lifestyle, pastConditions }) => {
  const profile = await HealthProfile.create({
    userId,
    label: label || "other",
    displayName,
    age,
    habits: habits || {},
    lifestyle: lifestyle || [],
    pastConditions: pastConditions || []
  });

  await User.findByIdAndUpdate(userId, { $addToSet: { profiles: profile._id } });
  return profile;
};

export const listProfiles = async (userId) => {
  return HealthProfile.find({ userId }).sort({ createdAt: 1 }).lean();
};

