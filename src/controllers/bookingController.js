import logger from "../utilites/logger.js";
import Booking from "../models/bookingModel.js";
import { calculateETA } from "../utilites/calculateETA.js";

export const bookNow = async (req, res) => {
    try {
        const { nurse, client } = req.body;

        const booking = new Booking({ client, nurse });
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking created successfully. Waiting for approval...",
            booking
        });

    } catch (error) {
        logger.error(`Error booking nurse: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}, {"__v": 0})
       .populate("nurse", "userName email image location")
       .populate("client", "userName email image location");

        res.status(200).json({ success: true, bookings });
    }
    catch (error) {
        logger.error(`Error fetching bookings: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId)
        .populate("nurse", "userName email image location")
        .populate("client", "userName email image location");

        res.status(200).json({
            success: true,
            message: booking.status === 'approved' ? 'Booking approved!' : 'Waiting for approval...',
            booking
        });

    } catch (error) {
        logger.error(`Error fetching booking status: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const validStatuses = ["approved", "rejected"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const booking = await Booking.findById(bookingId);

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, message: `Booking ${status}`, booking });

    } catch (error) {
        logger.error(`Error updating booking status: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

// export const trackNurseLocation = (socket) => {
//     socket.on("trackNurse", async (bookingId) => {
//         try {
//             const booking = await Booking.findById(bookingId).populate("nurse");
//             if (!booking) {
//                 return socket.emit("trackingError", "Booking not found");
//             }
//             socket.emit("nurseLocation", booking.nurse.location);
//         } catch (error) {
//             socket.emit("trackingError", "Error tracking nurse location");
//         }
//     });
// };

// track nurse location
export const trackNurseLocation = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate("nurse");

        res.status(200).json({
            success: true,
            nurseLocation: booking.nurse.location 
        });

    } catch (error) {
        logger.error(`Error tracking nurse: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

// calculate estimated time
export const getETA = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate("nurse client");

        if (!booking.nurse.location || !booking.client.location) {
            return res.status(400).json({ success: false, message: "Location data missing" });
        }

        const nurseLocation = booking.nurse.location;
        const clientLocation = booking.client.location;

        const estimatedTime = calculateETA(nurseLocation, clientLocation); 

        res.status(200).json({ success: true, eta: estimatedTime, message: `It will arrive in ${estimatedTime} minutes.` });

    } catch (error) {
        logger.error(`Error calculating ETA: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

// cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ success: true, message: "Booking cancelled successfully" });

    } catch (error) {
        logger.error(`Error cancelling booking: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};