import express from 'express';
import { 
    register, 
    getAllNurses, 
    getNurseById, 
    updateNurse, 
    deleteNurse, 
    searchNurses, 
    getNursesBySpeciality, 
    addReview, 
    getNurseReviews 
} from '../controllers/nurseController.js';

import upload from '../middlewares/uploadImage.js';
import { nurseValidation } from "../validations/nurseValidation.js";
import nurseMiddleware from '../middlewares/nurseMiddleware.js';
import serviceMiddleware from '../middlewares/serviceMiddleware.js'

const router = express.Router();

router.post('/register', upload.single("image"), nurseValidation(false), nurseMiddleware, register);

router.get('/getAllNurses', getAllNurses);

router.get('/getNurse/:nurseId', nurseMiddleware, getNurseById);
router.patch('/update/:nurseId', nurseMiddleware, updateNurse);
router.delete('/delete/:nurseId', nurseMiddleware, deleteNurse);

router.get('/bySpecialty/:serviceId', serviceMiddleware, getNursesBySpeciality);

router.get('/search', serviceMiddleware, searchNurses);

router.post('/reviews/:nurseId', nurseMiddleware, addReview);

router.get('/reviews/:nurseId', nurseMiddleware, getNurseReviews);

export default router;
