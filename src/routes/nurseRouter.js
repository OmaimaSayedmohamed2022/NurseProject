import express from 'express';
import { register, getAllNurses, getNurseById, updateNurse, updateNurseAvailability, deleteNurse ,
    getNursesBySpeciality,searchNurses, addReview,getNurseReviews,getNurseCompletedSessions
} from '../controllers/nurseController.js';
import upload from '../middlewares/uploadImage.js';
import {nurseValidation} from "../validations/nurseValidation.js"
import nurseMiddleware from '../middlewares/nurseMiddleware.js';
import { contactUs } from '../controllers/contactController.js';
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', upload.fields([
    { name: "image", maxCount: 1 }, 
    { name: "cv", maxCount: 1 }]), nurseValidation(false), nurseMiddleware, register);

router.get('/getAllNurses', getAllNurses);

router.get('/getNurse/:nurseId', getNurseById);
router.patch('/update/:nurseId', upload.single("image"), nurseMiddleware, updateNurse);
router.delete('/delete/:nurseId', deleteNurse);

router.patch('/updateNurseAvailability/:nurseId', nurseMiddleware, updateNurseAvailability);

router.get('/bySpecialty/:serviceId', getNursesBySpeciality);

router.get('/search', searchNurses);

router.post('/reviews/:nurseId', nurseMiddleware, addReview);

router.get('/reviews/:nurseId', nurseMiddleware, getNurseReviews);

//contact
router.post("/contactUs",verifyToken,contactUs)
router.get("/NumOfSessions/:nurseId",getNurseCompletedSessions)




export default router;
