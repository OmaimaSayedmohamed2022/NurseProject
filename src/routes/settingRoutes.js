import express from "express";
import multer from "multer";
import { updateSetting,getSetting ,updatePrivacyPolicy,renderPrivacyPolicyPage,
    helpSetting,getHelp
} from "../controllers/settingController.js";
import upload from '../middlewares/uploadImage.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { autoPermission } from '../middlewares/autoPermissions.js';

const router = express.Router();

router.use(verifyToken);
router.use(autoPermission("setting")); 



router.put("/about",  upload.single("image"), updateSetting );
router.get("/getabout", getSetting);
router.put("/privacy", updatePrivacyPolicy);
router.get("/getprivacy", renderPrivacyPolicyPage);

router.put("/help", upload.single("photo"), helpSetting );
router.get("/gethelp", getHelp);
export default router;
