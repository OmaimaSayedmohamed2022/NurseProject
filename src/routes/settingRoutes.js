import express from "express";
import multer from "multer";
import { updateSetting,getSetting ,updatePrivacyPolicy,renderPrivacyPolicyPage,
    helpSetting,getHelp
} from "../controllers/settingController.js";
import { verifyToken, authorizeRole } from "../middlewares/authMiddleware.js";
import upload from '../middlewares/uploadImage.js';

const router = express.Router();


router.put("/about", verifyToken, authorizeRole("Admin"), upload.single("image"), updateSetting );
router.get("/getabout", getSetting);
router.put("/privacy", verifyToken, authorizeRole("Admin"), updatePrivacyPolicy);
router.get("/getprivacy", renderPrivacyPolicyPage);

router.put("/help", verifyToken, authorizeRole("Admin"), upload.single("photo"), helpSetting );
router.get("/gethelp", getHelp);
export default router;
