import express from "express";
const router = express.Router();
import sickRouter from './sickRoutes.js'
import nurseRouter from "./nurseRouter.js"



router.use("/sick",sickRouter);
router.use("/nurse",nurseRouter);


export default router


