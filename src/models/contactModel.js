import mongoose from "mongoose";
import {historyPlugin} from "../utilites/historyPlugin.js"

const contactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
contactSchema.plugin(historyPlugin, { moduleName: "Contact" });

export default mongoose.model("Contact", contactSchema);


