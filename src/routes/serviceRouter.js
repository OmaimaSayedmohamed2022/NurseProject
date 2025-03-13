import express from 'express';
import { addService, getAllServices, getServiceById, updateService, deleteService } from "../controllers/serviceController.js";
// import {validateService} from "../validations/serviceValidation.js";
// import serviceMiddleware from '../middlewares/serviceMiddleware.js';
const router = express.Router();

router.post("/addService",  addService);

router.get("/getAllServices", getAllServices);

router.get("/getService/:serviceId", getServiceById);

router.patch("/updateService/:serviceId",  updateService);

router.delete("/deleteService/:serviceId",  deleteService);

export default router;