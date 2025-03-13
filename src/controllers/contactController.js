import express from "express";
import Contact from "../models/contactModel.js"; 
const router = express.Router();


export const contactUs = async (req, res) => {
  try {
    const { fullName, message } = req.body;

    if (!fullName || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({ fullName, message });
    await newContact.save();

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export default router;
