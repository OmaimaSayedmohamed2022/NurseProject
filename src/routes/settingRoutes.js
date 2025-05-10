import express from "express";
import multer from "multer";
import { updateSetting,getSetting ,updatePrivacyPolicy,renderPrivacyPolicyPage,
    helpSetting,getHelp, 
} from "../controllers/settingController.js";
import { getAllContacts } from "../controllers/contactController.js";
import upload from '../middlewares/uploadImage.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { autoPermission } from '../middlewares/autoPermissions.js';

const router = express.Router();


router.get("/getabout", getSetting);
router.get("/getprivacy", renderPrivacyPolicyPage);
router.get("/gethelp", getHelp);
router.get("/contacts",getAllContacts)

router.use(verifyToken);
router.use(autoPermission("setting")); 
// abou page
router.put("/about",  upload.single("image"), updateSetting );

// privacy 
router.put("/privacy", updatePrivacyPolicy);

// help
router.put("/help", upload.single("photo"), helpSetting );




export default router;
