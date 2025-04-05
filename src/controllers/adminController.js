import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ userName, email, password:hashedPassword });
        await newAdmin.save();

        res.status(201).json({ success: true, message: "Admin created successfully" });
    } catch (error) {
        console.error("Error creating admin:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


