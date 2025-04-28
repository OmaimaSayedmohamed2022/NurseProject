import express from 'express';
import { search, getAllServices } from '../controllers/serviceDashboardController.js';
import { addService, getServiceById, updateService, deleteService } from "../controllers/serviceController.js";

import { verifyToken } from '../middlewares/authMiddleware.js';
import { autoPermission } from '../middlewares/autoPermissions.js';
import upload from '../middlewares/uploadImage.js';

const router = express.Router();

router.use(verifyToken);
router.use(autoPermission("service")); 

router.get('/search', search);
router.get('/services', getAllServices);

router.post("/addService", upload.single("icon"), addService);
router.get("/getService/:serviceId", getServiceById);
router.patch("/updateService/:serviceId",  updateService);
router.delete("/deleteService/:serviceId",  deleteService);


export default router;
