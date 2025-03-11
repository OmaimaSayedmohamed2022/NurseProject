import mongoose from "mongoose"

const clientSchema = new mongoose.Schema({

    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, enum: ['sick', 'nurse'], required: true },
    phone: { type: Number},

  },
  { timestamps: true }
);

const Client = mongoose.model("Client" ,clientSchema);
export default Client;