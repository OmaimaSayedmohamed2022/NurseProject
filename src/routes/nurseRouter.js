import express from 'express';
import { register, getAllNurses, getNurseById, updateNurse, deleteNurse } from '../controllers/nurseController.js';
import upload from '../middlewares/uploadImage.js';
import {userValidation} from "../validations/userValidation.js"
import nurseMiddleware from '../middlewares/nurseMiddleware.js';

const router = express.Router();

router.post('/register', upload.single("image"), userValidation(false), nurseMiddleware, register);

router.get('/getAllNurses', getAllNurses);

router.get('/getNurse/:nurseId', nurseMiddleware, getNurseById);
router.patch('/update/:nurseId', nurseMiddleware, updateNurse);
router.delete('/delete/:nurseId', nurseMiddleware, deleteNurse);


export default router;

