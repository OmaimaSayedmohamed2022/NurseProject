import express from "express";
import { searchEmergencySessions, getEmergencySessions } from "../controllers/emergencyDashboardController.js";

const router = express.Router();

router.get("/search", searchEmergencySessions);

router.get("/emergencySessions", getEmergencySessions);

export default router;
