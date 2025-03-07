import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import logger from "../utilites/logger.js";

const bookingMiddleware = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { client } = req.body; 

        if (bookingId) {
            if (!mongoose.Types.ObjectId.isValid(bookingId)) {
                return res.status(400).json({ success: false, message: "Invalid booking ID format" });
            }

            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ success: false, message: "Booking not found" });
            }

            req.document = booking;
        }

        if (client) {
            const existingBooking = await Booking.findOne({ client, status: "pending" });
            if (existingBooking) {
                return res.status(400).json({ success: false, message: "You already have a pending booking." });
            }
        }

        next();
    } catch (error) {
        logger.error("Error in bookingMiddleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default bookingMiddleware;
