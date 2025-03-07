import express from 'express';
import { createSession } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/createSession', createSession);

export default router;