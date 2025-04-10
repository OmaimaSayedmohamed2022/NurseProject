import bcrypt from "bcryptjs";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import logger from "../utilites/logger.js";
import Nurse from "../models/nurseModel.js";
import Service from "../models/serviceModel.js";
import { generateToken } from "../middlewares/authMiddleware.js";
import catchAsync from "../utilites/catchAsync.js";

// Register nurse
export const register = catchAsync(async (req, res) => {
    const { userName, email, password, role, phone, experience, specialty, idCard, location } = req.body;

    const validSpecialties = await Service.find({ _id: { $in: specialty } });
    if (validSpecialties.length !== specialty.length) {
        return res.status(400).json({ success: false, message: "One or more specialties are invalid." });
    }

    await Nurse.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let image = "";
    let cv = "";

    if (req.files?.image) {
        try {
            image = await uploadToCloudinary(req.files.image[0].buffer);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }
    }

    if (req.files?.cv) {
        try {
            cv = await uploadToCloudinary(req.files.cv[0].buffer);
        } catch (error) {
            return res.status(500).json({ success: false, message: "CV upload failed" });
        }
    }

    const newNurse = new Nurse({
        userName,
        email,
        password: hashedPassword,
        role,
        phone,
        image,
        cv,
        experience,
        specialty,
        idCard,
        location
    });

    const token = generateToken({ _id: newNurse._id, email, role });

    await newNurse.save();
    res.status(201).json({ success: true, message: 'Nurse registered successfully', newNurse, token });
});

// Get all nurses
export const getAllNurses = catchAsync(async (req, res) => {
    const nurses = await Nurse.find({ confirmed: true }, { "password": 0, "__v": 0 }).populate("specialty");
    res.status(200).json({ success: true, data: nurses });
});

// Get nurse by ID
export const getNurseById = catchAsync(async (req, res) => {
    const { nurseId } = req.params;
    const nurse = await Nurse.findById(nurseId, { password: 0, __v: 0 }).populate("specialty reviews");
    res.status(200).json({ success: true, data: nurse });
});

// Update nurse
export const updateNurse = catchAsync(async (req, res) => {
    const { nurseId } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
        try {
            const uploadedImage = await uploadToCloudinary(req.file.buffer);
            updateData.image = uploadedImage;
        } catch (error) {
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }
    }

    const updatedNurse = await Nurse.findByIdAndUpdate(nurseId, updateData, { new: true });
    res.status(200).json({ success: true, message: 'Nurse updated successfully', data: updatedNurse });
});

// Delete nurse
export const deleteNurse = catchAsync(async (req, res) => {
    const { nurseId } = req.params;
    await Nurse.findByIdAndDelete(nurseId);
    res.status(200).json({ success: true, message: 'Nurse deleted successfully' });
});

// Get nurses by specialty
export const getNursesBySpeciality = catchAsync(async (req, res) => {
    const { serviceId } = req.query;
    const service = await Service.findById(serviceId);
    const nurses = await Nurse.find({ service })
        .select("userName rating clients specialty")
        .populate('specialty', "name duration price")
        .populate('clients');
    res.status(200).json({ success: true, nurses });
});

// Add review
export const addReview = catchAsync(async (req, res) => {
    const { nurseId } = req.params;
    const { client, comment, rating } = req.body;

    const nurse = await Nurse.findById(nurseId);

    const newReview = { client, rating, comment };
    nurse.reviews.push(newReview);

    const totalReviews = nurse.reviews.length;
    const averageRating = nurse.reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews;
    nurse.rating = Math.round(averageRating);

    await nurse.save();

    res.status(201).json({ success: true, message: "Review added successfully", reviews: nurse.reviews });
});

// Get nurse reviews
export const getNurseReviews = catchAsync(async (req, res) => {
    const { nurseId } = req.params;
    const nurse = await Nurse.findById(nurseId).populate("reviews.client", "userName image");
    res.status(200).json({ success: true, reviews: nurse.reviews });
});

// Search nurses by location
export const searchNurses = catchAsync(async (req, res) => {
    const { service, latitude, longitude, range } = req.query;

    if (!service || !latitude || !longitude || !range) {
        return res.status(400).json({ success: false, message: "Missing required parameters" });
    }

    const serviceDoc = await Service.findOne({ service });

    const nurses = await Nurse.find({
        specialty: serviceDoc,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                $maxDistance: parseFloat(range) * 1000,
            },
        },
    }).select("-password -__v");

    res.status(200).json({ success: true, nurses });
});

// Get nurse completed sessions
export const getNurseCompletedSessions = catchAsync(async (req, res) => {
    const { nurseId } = req.params;
    const nurse = await Nurse.findById(nurseId).select("userName completedSessions");

    if (!nurse) {
        return res.status(404).json({ success: false, message: "Nurse not found" });
      }
  
      res.status(200).json({ success: true, completedSessions: nurse.completedSessions });
    } catch (error) {
      logger.error(`Error fetching completed sessions: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  // Get all unconfirmed nurses
export const getUnconfirmedNurses = async (req, res) => {
    try {
        const unconfirmedNurses = await Nurse.find({ confirmed: false }).select("-password -__v");
        res.status(200).json({ success: true, nurses: unconfirmedNurses });
    } catch (error) {
        logger.error(`Error fetching unconfirmed nurses: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
// confirm nurse
export const confirmNurse = async (req, res) => {
    try {
        const { id } = req.params;
        const nurse = await Nurse.findByIdAndUpdate(id, { confirmed: true }, { new: true });

    if (!nurse) {
        return res.status(404).json({ success: false, message: "Nurse not found" });
    }

        res.status(200).json({ success: true, message: "Nurse confirmed successfully", data: nurse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};