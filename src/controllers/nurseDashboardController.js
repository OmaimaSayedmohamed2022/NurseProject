import Nurse from "../models/nurseModel.js";
import logger from "../utilites/logger.js";
import Service from '../models/serviceModel.js';
import Session from "../models/sessionModel.js";
import Client from "../models/clientModel.js"
import pagination from "../utilites/pagination.js";

// Search for nurse
export const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i");

    const nurses = await Nurse.find({
      userName: searchRegex,
    });

    res.status(200).json({
      success: true,
      results: {
        nurses,
      },
    });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Specializations
export const getServicesCount = async (req, res) => {
  try {
      const count = await Service.countDocuments();
      res.status(200).json({ status: true, count });
  }
  catch (error) {
      logger.error(`Error fetching services: ${error.message}`);
      res.status(500).json({ success: false, message: error.message })
  }
}

// Deleted


// Nurses
export const getAllNurses = async (req, res) => {
  try {
    const { page } = req.query;
    const data = await pagination(
      Nurse,
      { status: 'confirmed' },
      page,
      14, 
      {},
      'userName phone image licenseNumber createdAt specialty', 
      { path: 'specialty', select: 'name' } 
    );

    res.status(200).json({
      message: "nurses fetched successfully.",
      ...data
    });
  } catch (error) {
    logger.error(`Error fetching nurses: ${error.message}`);
    res.status(500).json({ message: "Error fetching nurses.", error: error.message });
  }}

    
  // Patients
  export const getPatientsForNurse = async (req, res) => {
    const { nurseId } = req.params;
    try {
      const count = await Session.distinct("client", { nurse: nurseId });
      res.status(200).json({ success: true, count: count.length });
    }
    catch (error) {
      logger.error(`Error getting patients: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Earnings
  export const getNurseEarnings = async (req, res) => {
    const { nurseId } = req.params;
    try {
      const sessions = await Session.find({ nurse: nurseId, status: "confirmed" }).populate("service");
  
      let total = 0;
      sessions.forEach(session => {
        total += session.service?.price || 0;
      });
  
      res.status(200).json({ success: true, total });
    } catch (error) {
      logger.error(`Error getting earnings: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Confirmed, Pending, Canceled Sessions
  export const getNurseSessions = async (req, res) => {
    const { nurseId } = req.params;

    try {
      const confirmedCount = await Session.countDocuments({ nurse: nurseId, status: "confirmed" });
      const pendingCount = await Session.countDocuments({ nurse: nurseId, status: "pending" });
      const canceledCount = await Session.countDocuments({ nurse: nurseId, status: "canceled" });

      res.status(200).json({ success: true, pendingCount: pendingCount, canceledCount: canceledCount, confirmedCount: confirmedCount});
    } catch (error) {
      logger.error(`Error getting sessions: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Recent Visits
  export const getRecentVisits = async (req, res) => {
    const { nurseId } = req.params;
    try {
      const sessions = await Session.find({
        nurse: nurseId,
        status: "confirmed"
      })
        .sort({ date: -1 }) 
        .limit(6)
        .populate("client", "userName")
        .populate("service", "name subcategories");
  
      const formattedSessions = sessions.map(session => {
        const subCategoryName = session.service?.subcategories[0]?.name || 'N/A'; 
  
        return {
          clientName: session.client?.userName,  
          serviceName: session.service?.name,    
          subCategoryName,                       
          date: session.date                     
        };
      });
  
      res.status(200).json({ success: true, sessions: formattedSessions });
    } catch (error) {
      logger.error(`Error getting recent visits: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  // Patient Notes
  export const getNurseReviews = async (req, res) => {
    const { nurseId } = req.params;
    try {
      const nurse = await Nurse.findById(nurseId)
        .populate({
          path: "reviews.client",  
          select: "userName",    
        })
        .select("reviews");      
  
      if (!nurse) {
        return res.status(404).json({ success: false, message: "Nurse not found" });
      }
  
      const formattedReviews = nurse.reviews.map(review => ({
        clientName: review.client?.userName,
        comment: review.comment,  
        createdAt: review.createdAt  
      }));
  
      res.status(200).json({ success: true, reviews: formattedReviews });
    } catch (error) {
      logger.error(`Error fetching reviews: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  