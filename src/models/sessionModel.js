import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      ref: "Service",
      // required: true,
    },
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nurse",
      // required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      // required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },
    code: {
      type: String,
      unique: true,
      sparse: true
    },
   nurseName:{ type: String },
   clientName:{ type: String},
   location: { type: String }, 
   date: { type: Date },

   status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
   paymentStatus:{ type:String ,enum:["Cash","Visa"], defult:"Cash" },
   total: { type: Number },

   tubeImage: { type: String },
   videoOrPhotos: { type: String },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;