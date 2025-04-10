import Session from "../models/sessionModel.js"
import Nurse from "../models/nurseModel.js"
import Client from "../models/clientModel.js"
import Service from '../models/serviceModel.js';
import logger from "../utilites/logger.js"


// Appointments
export const getAppointmentsCount = async (req, res) => {
    try {
        const count = await Session.countDocuments({ status: "confirmed" });
        res.status(200).json({ success: true, count });
    }
    catch (error) {
        logger.error(`Internal server error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
}

// New Patients
export const getNewPatientsCount = async (req, res) => {
  try {
    const result = await Client.aggregate([
      {
        $match: { role: "sick" }
      },
      {
        $lookup: {
          from: "sessions",
          localField: "_id",
          foreignField: "client",
          as: "sessions"
        }
      },
      {
        $addFields: {
          hasConfirmedSession: {
            $anyElementTrue: {
              $map: {
                input: "$sessions",
                as: "session",
                in: { $eq: ["$$session.status", "confirmed"] }
              }
            }
          }
        }
      },
      {
        $match: {
          hasConfirmedSession: false
        }
      },
      {
        $count: "newPatientsCount"
      }
    ]);

    const count = result[0]?.newPatientsCount || 0;

    res.status(200).json({ success: true, count });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Nurses
export const getNursesByStatus = async (req, res) => {
  try {
      const confirmedCount = await Nurse.countDocuments({ status: 'confirmed' });
      const unconfirmedCount = await Nurse.countDocuments({ status: 'pending' });
      const rejectedCount = await Nurse.countDocuments({ status: 'rejected' });
      
      res.status(200).json({
          success: true,
          confirmed: confirmedCount,
          unconfirmed: unconfirmedCount,
          rejected: rejectedCount
      });
  }
  catch (error) {
      logger.error(`Internal server error: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
  }
}

// Earnings
export const getTotalEarnings = async (req, res) => {
  try {
    const confirmedSessions = await Session.find({ status: "confirmed" }).populate("service");

    let totalEarnings = 0;
    confirmedSessions.forEach(session => {
      if (session.service && session.service.price) {
        totalEarnings += session.service.price;
      }
    });

    res.status(200).json({ success: true, totalEarnings });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Clients Activity
export const getClientsActivity = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const result = await Client.aggregate([
      {
        $match: {
          createdAt: {
            $gte: thirtyDaysAgo,
            $lte: today,
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, result });
  } catch (error) {
      logger.error(`Internal server error: ${error.message}`);
      res.status(500).json({ success: false, message: error.message })
  }
};


// Patient Visits By Gender
export const getPatientVisitsByGender = async (req, res) => {
  try {
    const visits = await Session.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "clientInfo"
        }
      },
      { $unwind: "$clientInfo" },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            gender: "$clientInfo.gender"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          male: {
            $sum: {
              $cond: [{ $eq: ["$_id.gender", "Male"] }, "$count", 0]
            }
          },
          female: {
            $sum: {
              $cond: [{ $eq: ["$_id.gender", "Female"] }, "$count", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              [
                "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              "$_id"
            ]
          },
          male: 1,
          female: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    let totalMale = 0;
    let totalFemale = 0;

    visits.forEach((monthData) => {
      totalMale += monthData.male;
      totalFemale += monthData.female;
    });

    const totalVisits = totalMale + totalFemale;

    const malePercentage = totalVisits === 0 ? 0 : (totalMale / totalVisits) * 100;
    const femalePercentage = totalVisits === 0 ? 0 : (totalFemale / totalVisits) * 100;

    res.status(200).json({
      success: true,
      visits,
      totalMale,
      totalFemale,
      malePercentage,
      femalePercentage
    });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Clients Most Recent Analysis
export const getClientsMostRecentAnalysis = async (req,res) => {
    try{
        const purchasing = await Session.countDocuments({ status: 'confirmed' });
        const returns = await Session.countDocuments({ status: 'returned' }); 
        const requests = await Session.countDocuments({ status: 'pending' });
        const canceled = await Session.countDocuments({ status: 'canceled' });
        
        res.status(200).json({ success: true, purchasing, returns, requests, canceled });
    }
    catch (error) {
        logger.error(`Internal server error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message })
    }
}

// Tests Distribution
export const getTestsDistribution = async (req, res) => {
  try {
    const medicalTestsService = await Service.findOne({ name: "Medical Tests" });

    if (!medicalTestsService) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const testTypes = [
      "Blood test",
      "Sugar test",
      "Heart check",
      "Full check"
    ];

    const sessions = await Session.find({ 
      service: medicalTestsService._id, 
      status: "confirmed" 
    }).populate("service");

    const testCounts = {
      "Blood test": 0,
      "Sugar test": 0,
      "Heart check": 0,
      "Full check": 0
    };

    sessions.forEach(session => {
      session.service.subcategories.forEach(subcategory => {
        if (testTypes.includes(subcategory.name)) {
          testCounts[subcategory.name] += 1;
        }
      });
    });

    const totalTests = Object.values(testCounts).reduce((sum, count) => sum + count, 0);
    const percentages = {};
    
    testTypes.forEach(testType => {
      const count = testCounts[testType];
      percentages[testType] = totalTests === 0 ? 0 : (count / totalTests) * 100;
    });

    res.status(200).json({
      success: true,
      testCounts,
      percentages
    });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Available Nurses
export const getAvailableNurses = async (req, res) => {
    try {
      const availableNurses = await Nurse.find({ available: true });
  
      res.status(200).json({
        success: true,
        availableNurses
      });
    } catch (error) {
      logger.error(`Internal server error: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  };