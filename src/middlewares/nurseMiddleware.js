import mongoose from "mongoose";
import Nurse from "../models/nurseModel.js"
import logger from "../utilites/logger.js";

const nurseMiddleware = async (req, res, next) => {
    try {
        const { nurseId } = req.params;
        const { email, phone } = req.body;

        if (email || phone) {
            let existingField = null;

            if (email) {
                const existingEmail = await Nurse.findOne({ email });
                if (existingEmail) existingField = "Email";
            }

            if (phone) {
                const existingPhone = await Nurse.findOne({ phone });
                if (existingPhone) existingField = "Phone number";
            }

            if (existingField) {
                return res.status(400).json({ success: false, message: `${existingField} already exists` });
            }
        }

        if (nurseId) {
            if (!mongoose.Types.ObjectId.isValid(nurseId)) {
                return res.status(400).json({ success: false, message: "Invalid Nurse ID format" });
            }

            const nurse = await Nurse.findById(nurseId, { password: 0, __v: 0 });

            if (!nurse) {
                return res.status(404).json({ success: false, message: "Nurse not found" });
            }

            req.document = nurse;
        }

        next();
    } catch (error) {
        logger.error("Error in nurseMiddleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default nurseMiddleware;
