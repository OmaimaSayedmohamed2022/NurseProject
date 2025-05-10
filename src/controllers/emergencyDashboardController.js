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
  const { client } = req.body;

  if (!client) {
    return res.status(400).json({ success: false, message: "Client is required" });
  }

  const clientData = await Client.findById(client);
  if (!clientData) {
    return res.status(404).json({ success: false, message: "Client not found" });
  }

  const uniqueCode = generateCode();

  const session = new Session({
    client: clientData._id,
    code: uniqueCode,
    status: "emergency"
  });

  await session.save();

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
        select: "userName address",
      }
    ]
  );

  res.status(200).json({
    message: "Emergency sessions fetched successfully.",
    ...data,
  });
});