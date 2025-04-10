import Nurse from "../models/nurseModel.js";
import logger from "../utilites/logger.js";
import Service from '../models/serviceModel.js';
import Session from "../models/sessionModel.js";
import Client from "../models/clientModel.js"
import pagination from "../utilites/pagination.js";
import catchAsync from "../utilites/catchAsync.js";

export const search = catchAsync(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Search query is required" });
  }

  const searchRegex = new RegExp(query, "i");

  const services = await Service.find({
    name: searchRegex,
  }).select("-password -__v");

  res.status(200).json({
    success: true,
    services,
  });
});

export const getAllServices = catchAsync(async (req, res) => {
  const { page } = req.query;
  const data = await pagination(
    Service,
    {},
    page,
    14,
    {},
    "name description icon price offer createdAt"
  );

  res.status(200).json({
    message: "Services fetched successfully.",
    ...data,
  });
});
