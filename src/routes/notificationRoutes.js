import express from "express";
import { sendNotificationAPI, getUserNotifications,markNotificationAsRead ,updateNotification,deleteNotification} from "../controllers/notificationController.js";

import { verifyToken } from '../middlewares/authMiddleware.js';
import { autoPermission } from '../middlewares/autoPermissions.js';

const router = express.Router();

router.get("/:userId", getUserNotifications);
router.put("/read/:notificationId", markNotificationAsRead);

router.use(verifyToken);
router.use(autoPermission("notification")); 

router.post("/sendNotification", sendNotificationAPI);
router.put("/update/:notificationId", updateNotification);
router.delete("/delete/:notificationId", deleteNotification);

export default router;
