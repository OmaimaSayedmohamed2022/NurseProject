import Nurse from "../models/nurseModel.js";
import logger from "../utilites/logger.js"

const userDuplicate = async (req, res, next) => {
    try {
        const { email, phoneNumber } = req.body;

        let existingField = null;

        if (email) {
            const existingEmail = await Nurse.findOne({ email });
            if (existingEmail) existingField = "Email";
        }

        if (phoneNumber) {
            const existingPhone = await Nurse.findOne({ phoneNumber });
            if (existingPhone) existingField = "Phone number";
        }

        if (existingField) {
            return res.status(400).json({ success: false, message: `${existingField} already exists` });
        }

        next();
    } catch (error) {
        logger.error("Error in userDuplicate middleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default userDuplicate;
