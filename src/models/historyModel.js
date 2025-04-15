import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  module: String, 
  itemId: mongoose.Schema.Types.ObjectId,
  deletedBy: String,
  deletedAt: {
    type: Date,
    default: Date.now
  },
  data: Object, 
  description: String
});

const History = mongoose.model("History", historySchema);
export default History;
