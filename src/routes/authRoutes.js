import express from "express";
const  router= express.Router()
import { loginUser, logOutUser } from "../controllers/authController.js";


router.post('/login',loginUser)
router.post('/logout',logOutUser)

export default router;