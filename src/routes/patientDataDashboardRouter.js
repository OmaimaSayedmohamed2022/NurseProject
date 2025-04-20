import express from "express";
import {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,} from "../controllers/patientDataController.js";
import upload from "../middlewares/uploadImage.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { autoPermission } from "../middlewares/autoPermissions.js";
const router = express.Router();

router.use(verifyToken);
router.use(autoPermission("patientData"));


router.post("/add", upload.single("videoOrPhotos"),addPatient);

router.get("/", getAllPatients);
router.get("/:clientId", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);


export default router;
