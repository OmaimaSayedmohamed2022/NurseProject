import bcrypt from "bcryptjs";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import logger from "../utilites/logger.js";
import Nurse from "../models/nurseModel.js"
import Service from "../models/serviceModel.js";

export const register = async (req, res) => {
    try {
        const { userName, email, password, role, phone, experience, specialty, location, idCard } = req.body;
        
        const validSpecialties = await Service.find({ _id: { $in: specialty } });
        if (validSpecialties.length !== specialty.length) {
            return res.status(400).json({ success: false, message: "One or more specialties are invalid." });
        }

        await Nurse.findOne({ email });

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

        let parsedLocation = location;
        if (typeof location === "string") {
            try {
                parsedLocation = JSON.parse(location);
            } catch (error) {
                return res.status(400).json({ success: false, message: "Invalid location format" });
            }
        }

        if (!parsedLocation || !parsedLocation.coordinates || !Array.isArray(parsedLocation.coordinates) || parsedLocation.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                message: "Invalid location coordinates."
            });
        }

        // if (!location || !location.coordinates || location.coordinates.length !== 2) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Invalid location coordinates."
        //     });
        // }

        const newNurse = new Nurse({
            userName,
            email,
            password: hashedPassword,
            role,
            phone,
            image,
            experience,
            specialty,
            location,
            idCard,
        });
        
        await newNurse.save();
        res.status(201).json({ success: true, message: 'Nurse registered successfully', newNurse });
    }
    catch (error) {
        logger.error(`Error registering nurse: ${error.message}`);
        res.status(500).json({ success: false, message: error.message})
    }
}

export const getAllNurses = async (req, res) => {
    try {
        const nurses = await Nurse.find({}, { "password": 0, "__v": 0 }).populate("specialty");
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
        const nurse = await Nurse.findById(nurseId, { password: 0, __v: 0 }).populate("specialty reviews");

        res.status(200).json({ success: true, data: nurse });
    } catch (error) {
        logger.error(`Error getting nurse by ID: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateNurse = async (req, res) => {
    try {
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
    }
    catch (error) {
        logger.error(`Error updating nurse: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};



export const deleteNurse = async (req, res) => {
    try {
        const { nurseId } = req.params;
        await Nurse.findByIdAndDelete(nurseId);

        res.status(200).json({ success: true, message: 'Nurse deleted successfully' });
    }
    catch (error) {
        logger.error(`Error deleting nurse: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};


// get nurses by specialty
export const getNursesBySpeciality = async (req, res) => {
    try {
        const { serviceId } = req.query;
        const service = await Service.findById(serviceId);

        const nurses = await Nurse.find({ service })
        .select("userName rating clients specialty")
        .populate('specialty', "name duration price")
        .populate('clients');

        res.status(200).json({ success: true, nurses });
    } catch (error) {
        logger.error(`Error fetching nurses: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};


// add review
export const addReview = async (req, res) => {
    try {
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
    } catch (error) {
        logger.error(`Error adding review: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

// get nurse reviews
export const getNurseReviews = async (req, res) => {
    try {
        const { nurseId } = req.params;

        const nurse = await Nurse.findById(nurseId).populate("reviews.client", "userName image");

        res.status(200).json({ success: true, reviews: nurse.reviews });
    } catch (error) {
        logger.error(`Error fetching reviews: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

// search nurses by location 
export const searchNurses = async (req, res) => {
    try {
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
    } catch (error) {
        logger.error(`Error searching for nurses: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};