import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nurse",
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
      }],
    image: {
        type: String
    },
    code: {
        type: String,
        required: true,
        unique: true 
      },  
    amount: {
        type: Number,
        required: true
      },
    date: {
        type: Date,
        required: true
    }
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
