import mongoose from "mongoose"

const clientSchema = new mongoose.Schema({

    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'nurse'], required: true },
    phone: { type: Number},
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nurse"
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], //  GeoJSON Type
        default: "Point",
      },
      coordinates: {
        type: [Number], //  [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client" ,clientSchema);
export default Client;