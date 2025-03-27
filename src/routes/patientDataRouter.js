import express from "express";
import {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientDataController.js";

const router = express.Router();

router.post("/add", addPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
