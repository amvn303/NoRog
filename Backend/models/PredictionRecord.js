import mongoose from "mongoose";

const PredictionRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthProfile", required: true, index: true },
    source: { type: String, enum: ["infermedica", "local-fallback"], required: true },
    symptoms: { type: [String], required: true },
    normalizedConditions: [
      {
        name: { type: String, required: true },
        probability: { type: Number, default: 0 },
        rank: { type: Number, required: true }
      }
    ],
    confidence: { type: String, enum: ["Low", "Moderate", "High"], default: "Low" },
    behaviorAnalysis: { type: Object, default: {} },
    causeEffectChain: { type: [Object], default: [] },
    recommendations: { type: Object, default: {} },
    rawApiResponse: { type: Object, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("PredictionRecord", PredictionRecordSchema);

