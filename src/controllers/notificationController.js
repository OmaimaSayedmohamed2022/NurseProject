import Notification from "../models/NotificationModel.js"; 
import { io } from "../../app.js"; 

// Function to send & save notifications
export const sendNotification = async (userId, message) => {
  try {
    // Emit real-time notification
    io.to(userId).emit("notification", { message });

    // Save to MongoDB
    const newNotification = new Notification({ userId, message });
    await newNotification.save();
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// API to send a new notification
export const sendNotificationAPI = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ success: false, message: "User ID and message are required" });
    }
    await sendNotification(userId, message);
    res.json({ success: true, message: "Notification sent and saved!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending notification", error: error.message });
  }
};

// API to get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
  }
};


//  mark a notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notification = await Notification.findById(notificationId);
      
      if (!notification) {
        return res.status(404).json({ success: false, message: "Notification not found" });
      }
  
      notification.isRead= true;
      await notification.save();
  
      res.json({ success: true, message: "Notification marked as read", notification });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating notification", error: error.message });
    }
  };
  
