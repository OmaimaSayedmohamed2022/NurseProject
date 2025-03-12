import Session from "../models/sessionModel.js";
import Nurse from "../models/nurseModel.js";
import Service from "../models/serviceModel.js";
import Client from "../models/clientModel.js";
import Booking from "../models/bookingModel.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import {generateCode}from "../utilites/generateCode.js";
import logger from "../utilites/logger.js";

export const createSession = async (req, res) => {
    try {
      const { client, nurse, service } = req.body;
      const session = new Session({ client, nurse, service });
      await session.save();
      res.status(201).json({ success: true, message: "Session created", session });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("service")
      .populate("nurse")
      .populate("client")
    //   .populate("booking");

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
      const { nurseName, location, date } = req.body; // Extract location
  
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
  
      // **Update session with nurse’s location and date**
      session.nurseName = nurseName;
      session.location = location;
      session.date = date;
      session.code = code;
  
      await session.save();
  
      res.status(200).json({ success: true, message: "Session updated successfully", session });
    } catch (error) {
      logger.error("Error updating session:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  


export const getSessionsForNurse = async (req, res) => {
    try {
      const { nurseId } = req.params; // Get nurseId from request params
      let query = {}; // Default: get all sessions
  
      if (nurseId) {
        query.nurse = nurseId; 
      }
  
      const sessions = await Session.find(query)
        .populate("service")
        .populate("nurse")
        .populate("client")
        // .populate("booking");
  
      if (!sessions || sessions.length === 0) {
        return res.status(404).json({ message: "No sessions found" });
      }
  
      res.status(200).json({ success: true, sessions });
    } catch (error) {
      logger.error(`Error getting sessions: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
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

// confirm session 
export const confirmSession = async (req, res) => {
    try {
      const { sessionId } = req.params;
  
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, message: "Session not found" });
      }
  
      session.status = "confirmed";
      await session.save();
  
      res.status(200).json({ success: true, message: "Session confirmed", session });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
// cancel session 
export const cancelSession = async (req, res) => {
    try {
      const { sessionId } = req.params;
  
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, message: "Session not found" });
      }

    session.status = "canceled";
  
      res.status(200).json({ success: true, message: "Session canceled", session });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  