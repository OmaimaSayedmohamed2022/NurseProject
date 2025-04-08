import express from "express";
import { sendNotificationAPI, getUserNotifications,markNotificationAsRead ,updateNotification,deleteNotification} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/sendNotification", sendNotificationAPI);
router.get("/:userId", getUserNotifications);
router.put("/read/:notificationId", markNotificationAsRead);

router.put("/update/:notificationId", updateNotification);
router.delete("/delete/:notificationId", deleteNotification);

export default router;
