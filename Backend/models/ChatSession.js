import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true, trim: true },
    metadata: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ChatSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthProfile", required: true, index: true },
    isOnboardingComplete: { type: Boolean, default: false },
    onboardingState: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started"
    },
    messages: { type: [ChatMessageSchema], default: [] },
    extractedContext: {
      symptoms: { type: [String], default: [] },
      habits: { type: Object, default: {} },
      goals: { type: [String], default: [] },
      pastHealthHistory: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", ChatSessionSchema);

