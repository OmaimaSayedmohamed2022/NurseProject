import express from "express";
const router = express.Router();
import clientRoutes from './clientRoutes.js'
import nurseRouter from "./nurseRouter.js"
import  authRoutes from "./authRoutes.js"



router.use("/sick",clientRoutes);
router.use("/nurse",nurseRouter);
router.use("/auth",authRoutes)



export default router


