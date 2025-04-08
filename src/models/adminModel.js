import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio:{
      type:String
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Staff'],
      default: "Admin",
    },
    image: {
      type: String, // store image URL or file path
    },
    permissions: {
      addService: { type: Boolean, default: false },
      editService: { type: Boolean, default: false },
      deleteService: { type: Boolean, default: false },
      viewService: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
