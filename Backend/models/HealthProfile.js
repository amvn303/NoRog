import mongoose from "mongoose";

const BehaviorPatternSchema = new mongoose.Schema(
  {
    pattern: { type: String, required: true },
    score: { type: Number, default: 1 },
    lastSeenAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const HabitSchema = new mongoose.Schema(
  {
    screenTime: { type: String, default: "" },
    sleepQuality: { type: String, default: "" },
    focusLevel: { type: String, default: "" },
    exerciseFrequency: { type: String, default: "" },
    dietQuality: { type: String, default: "" },
    stressLevel: { type: String, default: "" }
  },
  { _id: false }
);

const HealthProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    label: {
      type: String,
      enum: ["self", "father", "mother", "sibling", "other"],
      default: "self"
    },
    displayName: { type: String, required: true, trim: true },
    age: { type: Number, min: 0, max: 120 },
    habits: { type: HabitSchema, default: () => ({}) },
    lifestyle: { type: [String], default: [] },
    pastConditions: { type: [String], default: [] },
    behaviorPatterns: { type: [BehaviorPatternSchema], default: [] },
    chatSummary: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("HealthProfile", HealthProfileSchema);

