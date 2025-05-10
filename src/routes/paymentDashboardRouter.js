import express from "express";
import { getPaymentStats, getInvoiceCountPerNurse } from "../controllers/paymentDashboardController.js";

const router = express.Router();

// GET /api/payment/stats?range=today || range=week
router.get("/stats", getPaymentStats);

router.get("/invoiceCount", getInvoiceCountPerNurse);

export default router;
