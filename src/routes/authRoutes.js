import express from "express";
const  router= express.Router()
import {saveFingerprint, loginUser, logOutUser } from "../controllers/authController.js";
import { resetPassword, sendOTPForResetPassword } from "../controllers/resetPasswordController.js";


router.post('/login',loginUser)
router.post('/logout',logOutUser)

router.post('/fingerPrint',saveFingerprint)

// forgetPassword
router.post("/sendOtp",sendOTPForResetPassword)
router.put('/resetPassword', resetPassword);


export default router;