import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  // professional: { type: mongoose.Schema.Types.ObjectId, required: true }, // Doctor or Nurse
  type: { type: String, enum: ["doctor", "nurse"], required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export const Consultation = mongoose.model("Consultation", consultationSchema);
