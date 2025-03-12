import express from 'express';
import { createSession, getSessions, addSessionData, getSessionByCode } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/createSession', createSession);

router.get('/getSessions', getSessions);

router.put('/addSessionData/:sessionId', upload.fields([
    { name: "tubeImage", maxCount: 1 },
    { name: "videoOrPhotos", maxCount: 1 }
  ]), addSessionData);

router.get('/getSessionByCode/:code', getSessionByCode);



export default router;