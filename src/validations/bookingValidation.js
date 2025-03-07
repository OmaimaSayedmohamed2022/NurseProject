import { body } from "express-validator";
import { validateRequest } from '../middlewares/validationResultMiddleware.js';
import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";

export const validateBooking = [

    body("client")
        .notEmpty().withMessage("Client ID is required")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid Client ID format"),

    body("nurse")
        .notEmpty().withMessage("Nurse ID is required")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid Nurse ID format"),

    body("status")
        .optional()
        .isIn(["pending", "approved", "rejected"])
        .withMessage("Status must be either 'pending', 'approved', or 'rejected'"),

    body("client").custom(async (value, { req }) => {
        const existingBooking = await Booking.findOne({ client: value, status: "pending" });
        if (existingBooking) {
            throw new Error("You already have a pending booking.");
        }
        return true;
    }),
    
    validateRequest,
];