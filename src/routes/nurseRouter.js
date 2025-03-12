import express from 'express';
import { register, getAllNurses, getNurseById, updateNurse, deleteNurse } from '../controllers/nurseController.js';
import upload from '../middlewares/uploadImage.js';
import {nurseValidation} from "../validations/nurseValidation.js"
import nurseMiddleware from '../middlewares/nurseMiddleware.js';
import { contactUs } from '../controllers/contactController.js';

const router = express.Router();

router.post('/register', upload.single("image"), nurseValidation(false), nurseMiddleware, register);

router.get('/getAllNurses', getAllNurses);

router.get('/getNurse/:nurseId', getNurseById);
router.patch('/update/:nurseId', updateNurse);
router.delete('/delete/:nurseId', deleteNurse);

//contact
router.post("/contactUs",contactUs)




export default router;

