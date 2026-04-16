import mongoose from "mongoose";

const SimulationRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthProfile", required: true, index: true },
    condition: { type: String, required: true },
    toggles: { type: Object, default: {} },
    result: { type: Object, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("SimulationRecord", SimulationRecordSchema);

