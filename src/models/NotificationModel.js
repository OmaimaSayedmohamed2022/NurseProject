import mongoose from "mongoose";
import {historyPlugin} from "../utilites/historyPlugin.js"

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  code:{ type:String,   unique: true,sparse: true},
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.plugin(historyPlugin, { moduleName: "Notification" });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
