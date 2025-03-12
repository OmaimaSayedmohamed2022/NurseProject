import express from "express";
const  router= express.Router()
import {saveFingerprint, loginUser, logOutUser } from "../controllers/authController.js";
// import { resetPassword } from "../controllers/resetPasswordController.js";


router.post('/login',loginUser)
router.post('/logout',logOutUser)

router.post('/fingerPrint',saveFingerprint)

// forgetPassword
// router.post('/resetPassword', resetPassword);

export default router;