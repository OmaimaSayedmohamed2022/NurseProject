import bcrypt from "bcryptjs";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import logger from "../utilites/logger.js";
import Nurse from "../models/nurseModel.js";
import Service from "../models/serviceModel.js";
import { generateToken } from "../middlewares/authMiddleware.js";
import { io } from "../../app.js";
import catchAsync from "../utilites/catchAsync.js";

// Register nurse
export const register = catchAsync(async (req, res) => {
    const { userName, email, password, role, phone, experience, about, specialty, idCard, location } = req.body;

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

    // Convert location from string to GeoJSON if needed
  let processedLocation;
  
  if (typeof location === 'string') {
    const coords = location.split(',').map(Number);
    if (coords.length !== 2 || coords.some(isNaN)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location format. Use 'longitude,latitude'"
      });
    }
    processedLocation = {
      type: "Point",
      coordinates: coords
    };
  } else if (location?.type === 'Point' && Array.isArray(location.coordinates)) {
    processedLocation = location;
  } else {
    return res.status(400).json({
      success: false,
      message: "Location must be in valid GeoJSON format"
    });
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
        about,
        specialty,
        idCard,
        location: processedLocation
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
// get by spcality
export const getNursesBySpeciality = catchAsync(async (req, res) => {
    const { serviceId } = req.params;

    if (!serviceId) {
        return res.status(400).json({ success: false, message: "Service ID is required" });
    }
    const nurses = await Nurse.find({ specialty: serviceId })
        .select("userName rating clients specialty image")
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
    const nurse = await Nurse.findById(nurseId).populate("reviews.client", "userName").select("userName image experience rating specialty reviews");
; 
    res.status(200).json({ success: true, data: nurse });
});

// Search nurses by location
export const searchNurses = async (req, res) => {
  try {
    const { lat, lng, range, service } = req.query;

    // Check for required parameters
    if (!lat || !lng || !service || !range) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters"
      });
    }

    // Build the query
    const query = {
      available: true,
      specialty: service,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(range) * 1000 
        }
      }
    };

    const nurses = await Nurse.find(query)
      .select("-password -__v");

    res.status(200).json({
      success: true,
      count: nurses.length,
      data: nurses
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};


// tracking location
export const trackNurseLocation = async (req, res) => {
  try {
    const { nurseId, lng, lat } = req.body;

    if (!nurseId || typeof lng === "undefined" || typeof lat === "undefined") {
      return res.status(400).json({
        success: false,
        message: "nurseId, lng, and lat are required."
      });
    }

    // update location
    const updatedNurse = await Nurse.findByIdAndUpdate(
      nurseId,
      {
        location: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        }
      },
      { new: true }
    ).select("userName location image");

    if (!updatedNurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found."
      });
    }

    io.emit(`nurseLocation:${nurseId}`, {
      nurseId,
      lng: parseFloat(lng),
      lat: parseFloat(lat),
      image: updatedNurse.image,
      userName: updatedNurse.userName
    });

    res.status(200).json({
      success: true,
      message: "Nurse location updated and broadcasted.",
      data: updatedNurse
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: err.message
    });
  }
};


// Get nurse completed sessions
export const getNurseCompletedSessions = catchAsync(async (req, res) => {
    const { nurseId } = req.params;
    const nurse = await Nurse.findById(nurseId).select("userName completedSessions");

    if (!nurse) {
        return res.status(404).json({ success: false, message: "Nurse not found" });
    }

    res.status(200).json({ success: true, completedSessions: nurse.completedSessions });
});

  

  // Get all unconfirmed nurses
export const getUnconfirmedNurses = catchAsync(async (req, res) => {
    const unconfirmedNurses = await Nurse.find({ confirmed: false }).select("-password -__v");
    res.status(200).json({ success: true, nurses: unconfirmedNurses });
});

// Confirm nurse
export const confirmNurse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const nurse = await Nurse.findByIdAndUpdate(id, { confirmed: true }, { new: true });

    if (!nurse) {
        return res.status(404).json({ success: false, message: "Nurse not found" });
    }

    res.status(200).json({ success: true, message: "Nurse confirmed successfully", data: nurse });
});

// Update Status
export const updateNurseAvailability = catchAsync(async (req, res) => {
  const { nurseId } = req.params;

  const nurse = await Nurse.findByIdAndUpdate(
    nurseId,
    { available: true },
    { new: true }
  );

  res.status(200).json({ success: true, message: "Nurse updated successfully", nurse });
});

export const updateNurseStatus = catchAsync(async (req, res) => {
  const { nurseId } = req.params;
  const { status } = req.body;

  if (!["confirmed", "rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value. It must be either 'confirmed' or 'rejected'."
    });
  }

  const updatedNurse = await Nurse.findByIdAndUpdate(
    nurseId,
    { status: status },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Nurse status updated successfully",
    nurse: updatedNurse
  });
});
