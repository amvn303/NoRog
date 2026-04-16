import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "HealthProfile" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

