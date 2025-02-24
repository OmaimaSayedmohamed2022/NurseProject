import bcrypt from "bcryptjs";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import logger from "../utilites/logger.js";
import User from "../models/userModel.js"

export const register = async (req, res) => {
    try {
        const { userName, email, password, role, phone } = req.body;
        
        await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let image = "";
        if (req.file) {
            try {
                // console.log(req.file.originalname);
                image = await uploadToCloudinary(req.file.buffer);
                // console.log(imageUrl);
            } catch (error) {
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }

        const newNurse = new User({
            userName,
            email,
            password: hashedPassword,
            role,
            phone,
            image
        });
        
        await newNurse.save();
        res.status(201).json({ success: true, message: 'Nurse registered successfully', data: newNurse });
    }
    catch (error) {
        logger.error(`Error registering nurse: ${error.message}`);
        res.status(500).json({ success: false, message: error.message})
    }
}

export const getAllNurses = async (req, res) => {
    try {
        const nurses = await User.find({}, { "password": 0, "__v": 0 });
        res.status(200).json({ success: true, data: nurses });
    }
    catch (error) {
        logger.error(`Error getting all nurses: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getNurseById = async (req, res) => {
    try {
        const { nurseId } = req.params;
        const nurse = await User.findById(nurseId, { password: 0, __v: 0 });

        res.status(200).json({ success: true, data: nurse });
    } catch (error) {
        logger.error(`Error getting nurse by ID: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateNurse = async (req, res) => {
    try {
        const { nurseId } = req.params;
        const updateNurse = await User.findByIdAndUpdate(nurseId, req.body, { new: true });

        res.status(200).json({ success: true, message: 'Nurse updated successfully', data: updateNurse });
    }
    catch (error) {
        logger.error(`Error updating nurse: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteNurse = async (req, res) => {
    try {
        const { nurseId } = req.params;
        await User.findByIdAndDelete(nurseId);

        res.status(200).json({ success: true, message: 'Nurse deleted successfully' });
    }
    catch (error) {
        logger.error(`Error deleting nurse: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};