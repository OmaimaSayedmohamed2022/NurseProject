import express from "express";
import { getPaymentStats } from "../controllers/paymentDashboardController.js";

const router = express.Router();

// GET /api/payment/stats?range=today || range=week
router.get("/stats", getPaymentStats);

export default router;
