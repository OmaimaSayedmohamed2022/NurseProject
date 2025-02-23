import mongoose from "mongoose";
import Nurse from "../models/nurseModel.js";

const nurseMiddleware = async (req, res, next) => {
    try {
        const { nurseId } = req.params;

        if (!nurseId) {
            return res.status(400).json({ success: false, message: "Nurse ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(nurseId)) {
            return res.status(400).json({ success: false, message: "Invalid Nurse ID format" });
        }

        const nurse = await Nurse.findById(nurseId, { password: 0, __v: 0 });

        if (!nurse) {
            return res.status(404).json({ success: false, message: "Nurse not found" });
        }

        req.document = nurse;
        next();
    } catch (error) {
        console.error(`Error validating Nurse ID: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export default nurseMiddleware;
