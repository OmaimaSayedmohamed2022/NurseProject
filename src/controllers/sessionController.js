import Session from "../models/sessionModel.js";
import Nurse from "../models/nurseModel.js";
import Service from "../models/serviceModel.js";
import Client from "../models/clientModel.js";
import Booking from "../models/bookingModel.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import {generateCode} from "../utilites/generateCode.js";
import logger from "../utilites/logger.js";

export const createSession = async (req, res) => {
  try {
    const { service, client, nurse, booking } = req.body;

    if (!service || !client || !nurse) {
      return res.status(400).json({ success: false, message: "Service, Client, and Nurse are required" });
    }

    const serviceData = await Service.findById(service);
    const clientData = await Client.findById(client);
    const nurseData = await Nurse.findById(nurse);

    if (!serviceData || !clientData || !nurseData) {
      return res.status(404).json({ success: false, message: "Invalid IDs: Service, Client, or Nurse not found" });
    }

    const session = new Session({
      service: serviceData._id,
      client: clientData._id,
      nurse: nurseData._id,
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });

  } catch (error) {
    logger.error("Error creating session:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("service")
      .populate("nurse")
      .populate("client")
      .populate("booking");

    if (!sessions) {
      return res.status(404).json({ message: "No sessions found" });
    }
    res.status(200).json({ status: true, sessions });
  } catch (error) {
    logger.error(`Error getting sessions: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addSessionData = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    let session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const code = generateCode();

    if (req.files) {
        if (req.files.tubeImage) {
          try {
            session.tubeImage = await uploadToCloudinary(req.files.tubeImage[0].buffer);
          } catch (error) {
            return res.status(500).json({ success: false, message: "Tube image upload failed" });
          }
        }
  
        if (req.files.videoOrPhotos) {
          try {
            session.videoOrPhotos = await uploadToCloudinary(req.files.videoOrPhotos[0].buffer);
          } catch (error) {
            return res.status(500).json({ success: false, message: "Video/Photo upload failed" });
          }
        }
      }

    session.code = code;

    await session.save();

    res.status(200).json({ success: true, message: "Session updated successfully", session });
  } catch (error) {
    logger.error("Error updating session:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSessionByCode = async (req, res) => {
    try {
        const { code } = req.params;
        if (!code) {
          return res.status(400).json({ success: false, message: "Code is required" });
        }
        const session = await Session.findOne({ code });

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        res.status(200).json({ success: true, session });
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
