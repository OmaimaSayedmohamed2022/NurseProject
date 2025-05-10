import mongoose from "mongoose";
import {historyPlugin} from "../utilites/historyPlugin.js"

const patientSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true, },
  name: { type: String, required: true },
  code: { type: String, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  description: { type: String },
  phoneNumber: { type: String },
  date: { type: Date, required: true },
  videoOrPhotos: [{ type: String }], 
}, { timestamps: true });

patientSchema.plugin(historyPlugin, { moduleName: "PatientData" });

const PatientData = mongoose.model("PatientData", patientSchema);
export default PatientData;
