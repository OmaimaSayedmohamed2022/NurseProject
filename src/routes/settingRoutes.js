import express from "express";
import multer from "multer";
import { updateSetting,getSetting ,updatePrivacyPolicy,renderPrivacyPolicyPage} from "../controllers/settingController.js";
import { verifyToken, authorizeRole } from "../middlewares/authMiddleware.js";
import upload from '../middlewares/uploadImage.js';

const router = express.Router();


router.put("/about", verifyToken, authorizeRole("Admin"), upload.single("image"), updateSetting );
router.get("/getabout", getSetting);
router.put("/privacy", verifyToken, authorizeRole("Admin"), updatePrivacyPolicy);
router.get("/getprivacy", renderPrivacyPolicyPage);
export default router;
