import express from 'express';
import { createSession, getSessions, addSessionData, getSessionByCode,
         getSessionsForNurse ,confirmSession,cancelSession,
         getSessionsByClient, getAllSessionData

       } from '../controllers/sessionController.js';
import upload from '../middlewares/uploadImage.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { autoPermission } from '../middlewares/autoPermissions.js';

const router = express.Router();

router.use(verifyToken);
router.use(autoPermission("session")); 

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




export default router;