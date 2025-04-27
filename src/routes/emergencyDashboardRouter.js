import express from "express";
import { searchEmergencySessions, getEmergencySessions, createEmergencySession } from "../controllers/emergencyDashboardController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { autoPermission  } from "../middlewares/autoPermissions.js";

const router = express.Router();

router.get("/emergencySessions", getEmergencySessions);

router.use(verifyToken);
router.use(autoPermission("emergency")); 

router.post("/createEmergencySession", createEmergencySession);

router.get("/search", searchEmergencySessions);



export default router;
