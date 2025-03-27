import express from "express";
import {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientDataController.js";
import upload from "../middlewares/uploadImage.js";

const router = express.Router();

router.post("/add", upload.single("videoOrPhotos"),addPatient);
router.get("/", getAllPatients);
router.get("/:clientId", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
