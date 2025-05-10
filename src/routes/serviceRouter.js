import express from 'express';
import {  getAllServices,getServiceById } from "../controllers/serviceController.js";

const router = express.Router();


router.get("/getAllServices", getAllServices);
router.get("/getService/:serviceId", getServiceById);



export default router;