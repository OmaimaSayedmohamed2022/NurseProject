import express from "express";
const router = express.Router();
import clientRoutes from './clientRoutes.js'
import nurseRouter from "./nurseRouter.js"
import authRoutes from "./authRoutes.js"
import notificationRoutes from "./notificationRoutes.js"
import sessionRoutes from "./sessionRoutes.js"
import serviceRouter from "./serviceRouter.js"
import consultationRouter from "./consultationRouter.js"
import bookingRouter from'./bookingRouter.js'
import patientDataRouter from "./patientDataRouter.js"
import homeDashboardRouter from "./homeDashboardRouter.js"


router.use("/client",clientRoutes);
router.use("/nurse",nurseRouter);
router.use("/auth",authRoutes)
router.use("/notification",notificationRoutes)
router.use("/session",sessionRoutes)
router.use("/service",serviceRouter)
router.use("/consultation",consultationRouter)
router.use("/booking",bookingRouter)
router.use("/patientData",patientDataRouter)
router.use("/homeDashboard", homeDashboardRouter)


export default router


