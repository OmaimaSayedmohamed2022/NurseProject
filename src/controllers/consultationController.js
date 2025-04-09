import { Consultation } from "../models/consultationModel.js";
import { sendNotification } from "./notificationController.js"
import catchAsync from "../utilites/catchAsync.js";

//  Request a new consultation
// 📝 Request a new consultation
export const requestConsultation = catchAsync(async (req, res) => {
  const { userId, professionalId, type } = req.body;

  if (!userId || !professionalId || !type) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const consultation = new Consultation({ user: userId, professional: professionalId, type });
  await consultation.save();

  // 🔔 Notify professional
  // await sendNotification(professionalId, `New ${type} consultation request from a user.`);

  res.status(201).json({
    success: true,
    message: "Consultation requested",
    data: consultation,
  });
});

// 📍 Get all consultations for a user
export const getUserConsultations = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const consultations = await Consultation.find({ user: userId }).populate("professional", "name");

  res.json({ success: true, consultations });
});

// ✅ Confirm a consultation
export const confirmConsultation = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    return res.status(404).json({ success: false, message: "Consultation not found" });
  }

  consultation.status = "confirmed";
  await consultation.save();

  // 🔔 Notify user
  await sendNotification(consultation.user, `Your consultation with a ${consultation.type} has been confirmed.`);

  res.json({ success: true, message: "Consultation confirmed", consultation });
});

// ❌ Cancel a consultation
export const cancelConsultation = catchAsync(async (req, res) => {
  const { consultationId } = req.params;

  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    return res.status(404).json({ success: false, message: "Consultation not found" });
  }

  consultation.status = "cancelled";
  await consultation.save();

  // 🔔 Notify user
  await sendNotification(consultation.user, `Your consultation has been cancelled.`);

  res.json({ success: true, message: "Consultation cancelled", consultation });
});
