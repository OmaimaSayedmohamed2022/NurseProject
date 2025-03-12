import express from "express";
import { sendNotificationAPI, getUserNotifications,markNotificationAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/sendNotification", sendNotificationAPI);
router.get("/:userId", getUserNotifications);
router.put("/read/:notificationId", markNotificationAsRead);

export default router;
