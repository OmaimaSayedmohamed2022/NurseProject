import express from "express";
const router = express.Router();
import clientRoutes from './clientRoutes.js'
import nurseRouter from "./nurseRouter.js"
import authRoutes from "./authRoutes.js"
import notificationRoutes from "./notificationRoutes.js"
import sessionRoutes from "./sessionRoutes.js"
import serviceRouter from "./serviceRouter.js"
import consultationRouter from "./consultationRouter.js"
import patientDataRouter from "./patientDataRouter.js"
import requestsRouter from  "./requestsRouter.js"
import adminRoutes from "./adminRouter.js";
import {verifyToken ,authorizeRole}from "../middlewares/authMiddleware.js"
import settingRoutes from './settingRoutes.js'
import historyRouter from "./historyRouter.js"



import homeDashboardRouter from "./homeDashboardRouter.js"
import nurseDashboardRouter from "./nurseDashboardRouter.js"
import patientDashboardRouter from "./patientDashboardRouter.js"
import serviceDashboardRouter from "./serviceDashboardRouter.js"


router.use("/client",clientRoutes);
router.use("/nurse",nurseRouter);
router.use("/auth",authRoutes)
router.use("/admin", adminRoutes);
router.use("/notification",notificationRoutes)
router.use("/session",sessionRoutes)
router.use("/service",serviceRouter)
router.use("/consultation",consultationRouter)
// router.use("/booking",bookingRouter)
router.use("/patientData",patientDataRouter)
router.use("/history",historyRouter)

router.use("/homeDashboard", homeDashboardRouter)
router.use("/nurseDashboard", nurseDashboardRouter)
router.use("/patientDashboard", patientDashboardRouter)
router.use("/serviceDashboard", serviceDashboardRouter)

router.use("/requests",requestsRouter)
router.use("/setting",settingRoutes)


export default router


