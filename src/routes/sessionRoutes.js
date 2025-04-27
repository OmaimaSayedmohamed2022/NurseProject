import express from 'express';
import { createSession, getSessions, addSessionData, getSessionByCode,
         getSessionsForNurse ,confirmSession,cancelSession,
         getSessionsByClient, getAllSessionData

       } from '../controllers/sessionController.js';
import upload from '../middlewares/uploadImage.js';

const router = express.Router();

router.post('/createSession', createSession);

router.get('/getSessions', getSessions);
router.get('/NurseSessions/:nurseId',getSessionsForNurse)

router.put('/addSessionData/:sessionId', upload.fields([
    { name: "tubeImage", maxCount: 1 },
    { name: "videoOrPhotos", maxCount: 1 }
  ]), addSessionData);


  // dashboard
router.get('/getSessionByCode/:code', getSessionByCode);
router.get('/getClientRequests/:clientId',getSessionsByClient)

router.put("/confirm/:sessionId", confirmSession)
router.put("/cancel/:sessionId", cancelSession)

router.get('/sessions', getAllSessionData);

// emwrgency sessions
router.post("/createEmergencySession", createEmergencySession);




export default router;
