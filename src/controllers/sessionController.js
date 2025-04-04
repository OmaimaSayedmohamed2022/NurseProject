import Session from "../models/sessionModel.js";
import Nurse from "../models/nurseModel.js";
import Service from "../models/serviceModel.js";
import Client from "../models/clientModel.js";
import Booking from "../models/bookingModel.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import {generateCode}from "../utilites/generateCode.js";
import logger from "../utilites/logger.js";
import mongoose from "mongoose";
import { sendNotification} from "./notificationController.js";


export const createSession = async (req, res) => {
  try {
    const { service, client, nurse, booking } = req.body;

    if (!service || !client || !nurse) {
      return res.status(400).json({ success: false, message: "Service, Client, and Nurse are required" });
    }

    // ✅ البحث عن الخدمة بالاسم إذا لم يكن ObjectId
    const serviceData = mongoose.Types.ObjectId.isValid(service)
      ? await Service.findById(service)
      : await Service.findOne({ name: service });

    const clientData = await Client.findById(client);
    const nurseData = await Nurse.findById(nurse);

    if (!serviceData || !clientData || !nurseData) {
      return res.status(404).json({ success: false, message: "Invalid IDs: Service, Client, or Nurse not found" });
    }

    const uniqueCode = generateCode();

    const session = new Session({
      service: serviceData._id,
      client: clientData._id,
      nurse: nurseData._id,
      code: uniqueCode,
    });

    await session.save();

    await sendNotification(nurse, `you have a new request with client ${clientData.userName}`);

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
      console.log("Sending notification to:", session.client);
     await sendNotification(session.client, `Your request is approved`);
      
  
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
    await sendNotification(session.client, `Your request is canceled`);
  
      res.status(200).json({ success: true, message: "Session canceled", session });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  export const getSessionsByClient = async (req, res) => {
    try {
      const { clientId } = req.params;
  
      // Check if the client exists
      const clientExists = await Client.findById(clientId);
      if (!clientExists) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      // Find all sessions related to the client
      const sessions = await Session.find({ client: clientId })
        .populate("nurse");
  
      if (!sessions.length) {
        return res.status(404).json({ success: false, message: "No sessions found for this client" });
      }
  
      res.status(200).json({ success: true, sessions });
    } catch (error) {
      logger.error(`Error fetching sessions for client: ${error.message}`);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  