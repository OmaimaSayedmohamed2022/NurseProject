import express from "express";
const router = express.Router();
import clientRoutes from './clientRoutes.js'
import nurseRouter from "./nurseRouter.js"
import authRoutes from "./authRoutes.js"
import notificationRoutes from "./notificationRoutes.js"
import sessionRoutes from "./sessionRoutes.js"



router.use("/client",clientRoutes);
router.use("/nurse",nurseRouter);
router.use("/auth",authRoutes)
router.use("/notification",notificationRoutes)
router.use("/session",sessionRoutes)


export default router


