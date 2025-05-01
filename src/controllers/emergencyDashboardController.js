import Nurse from "../models/nurseModel.js";
import logger from "../utilites/logger.js";
import Service from '../models/serviceModel.js';
import Session from "../models/sessionModel.js";
import Client from "../models/clientModel.js";
import pagination from "../utilites/pagination.js";
import mongoose from "mongoose";
import catchAsync from "../utilites/catchAsync.js";
import { sendNotification } from "./notificationController.js";
import { generateCode } from "../utilites/generateCode.js";

// search
export const searchEmergencySessions = catchAsync(async (req, res) => {
    const { query } = req.query;
  
    if (!query?.trim()) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }
  
    const searchRegex = new RegExp(query, "i");
  
    const sessions = await Session.find({ status: "emergency" })
      .populate({
        path: "client",
        match: { fullName: searchRegex },
        select: "fullName"
      })
      .populate("service", "name")
      .exec();
  
    const filteredSessions = sessions.filter(session => session.client !== null);
  
    res.status(200).json({ success: true, results: { sessions: filteredSessions } });
  });


  
// Create emergency session
export const createEmergencySession = catchAsync(async (req, res) => {
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
    status: "emergency" 
  });

  await session.save();

  await sendNotification(nurse, `Emergency request from client ${clientData.userName}`);

  res.status(201).json({
    success: true,
    message: "Emergency session created successfully",
    data: session,
  });
});



  // Get sessions
export const getEmergencySessions = catchAsync(async (req, res) => {
  const { page } = req.query;

  const data = await pagination(
    Session,
    { status: "emergency" },
    page,
    14, 
    { createdAt: -1 },
    "",
    [
      {
        path: "client",
        select: "userName location",
      }
    ]
  );

  res.status(200).json({
    message: "Emergency sessions fetched successfully.",
    ...data,
  });
});