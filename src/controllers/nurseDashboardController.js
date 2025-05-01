import Nurse from "../models/nurseModel.js";
import logger from "../utilites/logger.js";
import Service from '../models/serviceModel.js';
import Session from "../models/sessionModel.js";
import pagination from "../utilites/pagination.js";
import catchAsync from "../utilites/catchAsync.js";

// Search for nurse
export const search = catchAsync(async (req, res) => {
  const { query } = req.query;

  if (!query?.trim()) {
    return res.status(400).json({ success: false, message: "Search query is required" });
  }

  const searchRegex = new RegExp(query, "i");

  const nurses = await Nurse.find({
    userName: searchRegex,
  }).select("-password -__v");

  res.status(200).json({ success: true, results: { nurses } });
});

// Get service count
export const getServicesCount = catchAsync(async (req, res) => {
  const count = await Service.countDocuments();
  res.status(200).json({ status: true, count });
});

// Get all confirmed nurses
export const getAllNurses = catchAsync(async (req, res) => {
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

  res.status(200).json({ message: "Nurses fetched successfully.", ...data });
});

// Get patients for a nurse
export const getPatientsForNurse = catchAsync(async (req, res) => {
  const { nurseId } = req.params;
  const count = await Session.distinct("client", { nurse: nurseId });
  res.status(200).json({ success: true, count: count.length });
});

// Get nurse earnings
export const getNurseEarnings = catchAsync(async (req, res) => {
  const { nurseId } = req.params;
  const sessions = await Session.find({ nurse: nurseId, status: "confirmed" }).populate("service");

  const total = sessions.reduce((acc, session) => acc + (session.service?.price || 0), 0);

  res.status(200).json({ success: true, total });
});

// Get session stats
export const getNurseSessions = catchAsync(async (req, res) => {
  const { nurseId } = req.params;

  const statuses = ['confirmed', 'pending', 'canceled', 'completed']; // تم إضافة completed

  const results = await Promise.all(
    statuses.map(async (status) => {
      const sessions = await Session.find({ nurse: nurseId, status });
      return {
        status,
        count: sessions.length,
        sessions
      };
    })
  );

  const response = { success: true };
  results.forEach(({ status, count, sessions }) => {
    response[status] = { count, sessions };
  });

  res.status(200).json(response);
});

// Get recent visits
export const getRecentVisits = catchAsync(async (req, res) => {
  const { nurseId } = req.params;

  const sessions = await Session.find({ nurse: nurseId, status: "confirmed" })
    .sort({ date: -1 })
    .limit(6)
    .populate("client", "userName")
    .populate("service", "name subcategories");

  const formattedSessions = sessions.map(session => ({
    clientName: session.client?.userName,
    serviceName: session.service?.name,
    subCategoryName: session.service?.subcategories?.[0]?.name || 'N/A',
    date: session.date
  }));

  res.status(200).json({ success: true, sessions: formattedSessions });
});

// Get nurse reviews
export const getNurseReviews = catchAsync(async (req, res) => {
  const { nurseId } = req.params;

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
});

// skills
export const getSessionPercentagePerSkill = catchAsync(async (req, res) => {
  const { nurseId } = req.params;

  const sessions = await Session.find({ nurse: nurseId, status: "confirmed" }).populate("service", "name");

  if (!sessions.length) {
    return res.status(200).json({ success: true, data: [], message: "No sessions found for this nurse." });
  }

  const totalSessions = sessions.length;

  const countMap = {};
  sessions.forEach(session => {
    const name = session.service?.name || "Unknown";
    countMap[name] = (countMap[name] || 0) + 1;
  });

  const result = Object.entries(countMap).map(([name, count]) => ({
    [name]: Math.round((count / totalSessions) * 100)
  }));

  res.status(200).json({ success: true, data: result });
});

