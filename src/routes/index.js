import express from "express";
const router = express.Router();
import sickRouter from './sickRoutes.js'


router.use("/sick",sickRouter)


export default router


