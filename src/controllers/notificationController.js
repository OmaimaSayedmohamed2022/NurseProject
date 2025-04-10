import Notification from "../models/NotificationModel.js";
import { io } from "../../app.js";
import catchAsync from "../utilites/catchAsync.js"; 

// Function to send & save notifications
export const sendNotification = catchAsync(async (userId, message) => {
  // Emit real-time notification
  io.to(userId).emit("notification", { message });

  // Save to MongoDB
  const newNotification = new Notification({ userId, message });
  await newNotification.save();
});

// API to send a new notification
export const sendNotificationAPI = catchAsync(async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ success: false, message: "User ID and message are required" });
  }
  await sendNotification(userId, message);
  res.json({ success: true, message: "Notification sent and saved!" });
});

// API to get user notifications
export const getUserNotifications = catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  res.json({ success: true, notifications });
});

// Mark a notification as read
export const markNotificationAsRead = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  notification.isRead = true;
  await notification.save();

  res.json({ success: true, message: "Notification marked as read", notification });
});

// Update notification
export const updateNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const { message } = req.body;

  const notification = await Notification.findById(notificationId);
  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  if (message) notification.message = message;
  await notification.save();

  res.json({ success: true, message: "Notification updated", notification });
});

// Delete notification
export const deleteNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findByIdAndDelete(notificationId);

  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  res.json({ success: true, message: "Notification deleted" });
});
