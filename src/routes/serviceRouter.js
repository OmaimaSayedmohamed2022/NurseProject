import express from 'express';
import { addService, getAllServices, getServiceById, updateService, deleteService } from "../controllers/serviceController.js";
import {validateService} from "../validations/serviceValidation.js";
import serviceMiddleware from '../middlewares/serviceMiddleware.js';
const router = express.Router();

router.post("/addService", validateService(false), serviceMiddleware, addService);

router.get("/getAllServices", serviceMiddleware, getAllServices);

router.get("/getService/:serviceId", serviceMiddleware, getServiceById);

router.patch("/updateService/:serviceId", serviceMiddleware, updateService);

router.delete("/deleteService/:serviceId", serviceMiddleware, deleteService);

export default router;