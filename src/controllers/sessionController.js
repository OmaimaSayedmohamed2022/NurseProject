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

    const serviceData = await Service.findById(service);
    const clientData = await Client.findById(client);
    const nearestNurse = await Nurse.findOne({ service });
    const bookingData = await Booking.findOne({ client, nurse });

    if (!nearestNurse) {
      return res
        .status(404)
        .json({ message: "No available nurses for this service" });
    }

    const session = new Session({
      serviceData,
      clientData,
      nearestNurse,
      bookingData,
    });

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate("service")
      .populate("nurse")
      .populate("client")
      .populate("booking");

    res
      .status(201)
      .json({
        status: true,
        message: "Session created sucsessfully",
        data: populatedSession,
      });
  } catch (error) {
    logger.error(`Error creating session: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
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
