import asyncCatch from '../utilites/catchAsync.js';
import Session from "../models/sessionModel.js";
import Nurse from "../models/nurseModel.js";
import Service from "../models/serviceModel.js";
import Client from "../models/clientModel.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import { generateCode } from "../utilites/generateCode.js";
import logger from "../utilites/logger.js";
import mongoose from "mongoose";
import { sendNotification } from "./notificationController.js";

// Create session
export const createSession = asyncCatch(async (req, res) => {
  const { service, client, nurse } = req.body;

  if (!service || !client || !nurse) {
    return res.status(400).json({ success: false, message: "Service, Client, and Nurse are required" });
  }

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
  await sendNotification(nurse, `You have a new request with client ${clientData.userName}`);

  res.status(201).json({
    success: true,
    message: "Session created successfully",
    data: session,
  });
});

// Get all sessions
export const getSessions = asyncCatch(async (req, res) => {
  const sessions = await Session.find()
    .populate("service")
    .populate("nurse")
    .populate("client");

  if (!sessions) {
    return res.status(404).json({ message: "No sessions found" });
  }

  res.status(200).json({ status: true, sessions });
});

// Add session data
export const addSessionData = asyncCatch(async (req, res) => {
  const { sessionId } = req.params;
  const { nurseName, location, date } = req.body;

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

  session.nurseName = nurseName;
  session.location = location;
  session.date = date;
  session.code = code;

  await session.save();
  res.status(200).json({ success: true, message: "Session updated successfully", session });
});

// Get sessions for a nurse
export const getSessionsForNurse = asyncCatch(async (req, res) => {
  const { nurseId } = req.params;
  let query = {};

  if (nurseId) {
    query.nurse = nurseId;
  }

  const sessions = await Session.find(query)
    .populate("service")
    .populate("nurse")
    .populate("client");

  if (!sessions || sessions.length === 0) {
    return res.status(404).json({ message: "No sessions found" });
  }

  res.status(200).json({ success: true, sessions });
});

// Get session by code
export const getSessionByCode = asyncCatch(async (req, res) => {
  const { code } = req.params;
  const session = await Session.findOne({ code })
    .populate("client", "-password -__v")
    .populate("nurse", "-password -__v");

  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  res.status(200).json({ success: true, session });
});

// Confirm session
export const confirmSession = asyncCatch(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findById(sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  session.status = "confirmed";
  await session.save();

  await sendNotification(session.client, `Your request is approved`);

  res.status(200).json({ success: true, message: "Session confirmed", session });
});

// Cancel session
export const cancelSession = asyncCatch(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findById(sessionId);
  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  session.status = "canceled";
  await sendNotification(session.client, `Your request is canceled`);

  res.status(200).json({ success: true, message: "Session canceled", session });
});

// Get sessions by client
export const getSessionsByClient = asyncCatch(async (req, res) => {
  const { clientId } = req.params;

  const clientExists = await Client.findById(clientId);
  if (!clientExists) {
    return res.status(404).json({ success: false, message: "Client not found" });
  }

  const sessions = await Session.find({ client: clientId }).populate("nurse");

  if (!sessions.length) {
    return res.status(404).json({ success: false, message: "No sessions found for this client" });
  }

  res.status(200).json({ success: true, sessions });
});

// get all sessions
export const getAllSessionData = asyncCatch(async (req, res) => {
  const sessions = await Session.find();

  res.status(200).json({
    success: true,
    count: sessions.length,
    sessions,
  });
});
