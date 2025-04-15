import Nurse from "../models/nurseModel.js";
import logger from "../utilites/logger.js";
import Service from '../models/serviceModel.js';
import Session from "../models/sessionModel.js";
import pagination from "../utilites/pagination.js";
import catchAsync from "../utilites/catchAsync.js";

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