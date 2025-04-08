import Nurse from "../models/nurseModel.js";
import logger from "../utilites/logger.js";
import Service from '../models/serviceModel.js';
import Session from "../models/sessionModel.js";
import Client from "../models/clientModel.js"
import pagination from "../utilites/pagination.js";

// Search for service
export const search = async (req, res) => {
  try {
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
      services
    });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// get services
export const getAllServices = async (req, res) => {
    try {
      const { page } = req.query;
      const data = await pagination(
        Service,
        {},
        page,
        14, 
        {},
        'name description icon price offer createdAt', 
      );
  
      res.status(200).json({
        message: "services fetched successfully.",
        ...data
      });
    } catch (error) {
      logger.error(`Error fetching services: ${error.message}`);
      res.status(500).json({ message: "Error fetching services", error: error.message });
    }}