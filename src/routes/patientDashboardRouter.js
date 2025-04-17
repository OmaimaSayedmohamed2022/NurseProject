import express from 'express';
import { search, getAllClients} from '../controllers/patientDashboardController.js';
import { autoPermission } from '../middlewares/autoPermissions.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { createUser,updateUser ,deleteUser,getUserById,getAllUsers} from "../controllers/clientConroller.js"
import { userValidation } from "../validations/userValidation.js"
import { userMiddleware } from "../middlewares/userMiddleware.js"
import upload from "../middlewares/uploadImage.js"

const router = express.Router();

router.use(verifyToken);
router.use(autoPermission("patient")); 

router.post("/create",userValidation(false),createUser)
router.patch("/update/:id",userMiddleware, upload.single("image"),userValidation(true),updateUser)
router.delete("/delete/:id",userMiddleware,deleteUser)
router.get("/getUser/:id",userMiddleware,getUserById)
router.get("/allUsers",getAllUsers)
router.get('/search', search);
router.get('/clients', getAllClients);



export default router;
