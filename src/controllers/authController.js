import bcrypt from "bcryptjs";
import Nurse from "../models/nurseModel.js";
import Client from "../models/clientModel.js"; 
import logger from "../utilites/logger.js";
import { generateFingerprint } from "../services/fingerPrint.js"
import { generateToken } from "../middlewares/authMiddleware.js";
import Admin from "../models/adminModel.js";
import catchAsync from "../utilites/catchAsync.js";

// Generate fingerprint
export const saveFingerprint = catchAsync(async (req, res) => {
    const { email } = req.body;
    const fingerprint = generateFingerprint(req);
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Bad request. Token is missing.' });
    }

    // Update Client (if exists)
    const clientUpdate = await Client.findOneAndUpdate(
        { email },
        { fingerprint },
        { new: true }
    );

    // Update Nurse (if exists)
    const nurseUpdate = await Nurse.findOneAndUpdate(
        { email },
        { fingerprint },
        { new: true }
    );

    // If neither was found, return error
    if (!clientUpdate && !nurseUpdate) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
        message: "Fingerprint saved successfully", 
        fingerprint,
        updatedClient: clientUpdate,
        updatedNurse: nurseUpdate
    });
});

// Login
export const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    let user = await Client.findOne({ email });
    let userType = "Client";

    if (!user) {
        user = await Nurse.findOne({ email });
        userType = "Nurse";
    }
    if (!user) {
        user = await Admin.findOne({ email });
        userType = "Admin";
    }

    if (!user) {
        logger.warn("User Not Found Try Again !");
        return res.status(404).json({ message: "User not found." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        logger.warn(`Invalid password attempt for email: ${email}`);
        return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check fingerprint
    const clientFingerprint = generateFingerprint(req);
    if (user.fingerprint && user.fingerprint !== clientFingerprint) {
        return res.status(403).json({ message: "Unauthorized device" });
    }

    // Generate JWT token
    const token = generateToken(user, userType);

    logger.info(`User logged in successfully as ${userType}: ${email}`);

    res.status(200).json({
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role || userType,
        },
    });
});

// Logout
const blacklist = new Set();

export const logOutUser = catchAsync(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'Bad request. Token is missing.' });
    }

    blacklist.add(token);

    res.status(200).json({ status: true, message: 'Logged out successfully.' });
});
