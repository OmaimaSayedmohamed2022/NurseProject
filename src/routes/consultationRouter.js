import express from "express";
import {
  requestConsultation,
  getUserConsultations,
  confirmConsultation,
  cancelConsultation
} from "../controllers/consultationController.js";

const router = express.Router();

router.post("/request", requestConsultation); 
router.get("/:userId", getUserConsultations); 
router.put("/confirm/:consultationId", confirmConsultation); 
router.put("/cancel/:consultationId", cancelConsultation); 

export default router;
