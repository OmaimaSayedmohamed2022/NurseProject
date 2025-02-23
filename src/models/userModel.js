import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    userName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    role: { type: String, enum: ['sick', 'nurse'], required: true },
    phone: { type: Number},
    image: { type: String }, // for nurse

  });

const User = mongoose.model("User" ,userSchema)
export default User;