import express from "express";
import { searchEmergencySessions, getEmergencySessions, createEmergencySession } from "../controllers/emergencyDashboardController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { autoPermission  } from "../middlewares/autoPermissions.js";

const router = express.Router();

router.use(verifyToken);
router.use(autoPermission("emergency")); 

router.post("/createEmergencySession", createEmergencySession);

router.get("/search", searchEmergencySessions);

router.get("/emergencySessions", getEmergencySessions);

export default router;
