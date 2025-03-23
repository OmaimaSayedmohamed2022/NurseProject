import { Consultation } from "../models/consultationModel.js";
import { sendNotification } from "./notificationController.js"

//  Request a new consultation
export const requestConsultation = async (req, res) => {
  try {
    const { userId, type } = req.body;
    if (!userId || !type) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const consultation = new Consultation({ user: userId, type });
    await consultation.save();

    // 🔔 Send notification to the professional
    // await sendNotification( `New ${type} consultation request from a user.`);

    res.status(201).json({ success: true, message: "Consultation requested", data: consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating consultation", error: error.message });
  }
};

// 📍 Get all consultations for a user
export const getUserConsultations = async (req, res) => {
  try {
    const { userId } = req.params;
    const consultations = await Consultation.find({ user: userId }).populate("professional", "name");
    res.json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching consultations", error: error.message });
  }
};

// 📍 Confirm a consultation
export const confirmConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return res.status(404).json({ success: false, message: "Consultation not found" });

    consultation.status = "confirmed";
    await consultation.save();

    // 🔔 Notify user
    await sendNotification(consultation.user, `Your consultation with a ${consultation.type} has been confirmed.`);

    res.json({ success: true, message: "Consultation confirmed", consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error confirming consultation", error: error.message });
  }
};

// 📍 Cancel a consultation
export const cancelConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return res.status(404).json({ success: false, message: "Consultation not found" });

    consultation.status = "cancelled";
    await consultation.save();

    // 🔔 Notify user
    await sendNotification(consultation.user, `Your consultation has been cancelled.`);

    res.json({ success: true, message: "Consultation cancelled", consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error cancelling consultation", error: error.message });
  }
};
