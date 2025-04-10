import Nurse from "../models/nurseModel.js";
// import Service from '../models/serviceModel.js';
// import Session from "../models/sessionModel.js";
import Client from "../models/clientModel.js";
import pagination from "../utilites/pagination.js";
import catchAsync from "../utilites/catchAsync.js";

// Search for client
export const search = catchAsync(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Search query is required" });
  }

  const searchRegex = new RegExp(query, "i");

  const clients = await Client.find({ userName: searchRegex }).select("-password -__v");

  res.status(200).json({
    success: true,
    results: { clients },
  });
});

// Get all clients with pagination
export const getAllClients = catchAsync(async (req, res) => {
  const { page } = req.query;

  const data = await pagination(
    Client,
    {},
    page,
    14,
    {},
    'userName phone gender age address bloodType createdAt'
  );

  res.status(200).json({
    message: "Clients fetched successfully.",
    ...data
  });
});
