import express from "express";
import {
  bookNow,
  getBookings,
  getBookingStatus,
  updateBookingStatus,
  trackNurseLocation,
  getETA,
  cancelBooking,
} from "../controllers/bookingController.js";
import bookingMiddleware from "../middlewares/bookingMiddleware.js";

const router = express.Router();

router.post("/bookNow", bookingMiddleware, bookNow);

router.get("/getBookings", getBookings)

router.get("/status/:bookingId", bookingMiddleware, getBookingStatus);
router.patch("/update/:bookingId", bookingMiddleware, updateBookingStatus);

router.get("/track/:bookingId", bookingMiddleware, trackNurseLocation);
router.get("/estimatedTimeOfArrival/:bookingId", bookingMiddleware, getETA);

router.delete("/cancelBooking/:bookingId", bookingMiddleware, cancelBooking);

export default router;