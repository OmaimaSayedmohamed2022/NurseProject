import express from "express";
const router = express.Router();

import clientRouter from "./clientRouter.js"
import nurseRouter from "./nurseRouter.js"
import bookingRouter from "./bookingRouter.js"
import serviceRouter from "./serviceRouter.js"
import sessionRouter from "./sessionRouter.js"


router.use("/client",clientRouter);
router.use("/nurse",nurseRouter);
router.use("/booking", bookingRouter);
router.use("/service", serviceRouter);
router.use("/session", sessionRouter);

export default router


