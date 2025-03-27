import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true, },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  description: { type: String },
  phoneNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  videoandPicture: { type: String }, 
}, { timestamps: true });

const PatientData = mongoose.model("PatientData", patientSchema);
export default PatientData;
