import express from 'express';
const router = express.Router();

import {
  search,
  getServicesCount,
  getAllNurses,
  getPatientsForNurse,
  getNurseEarnings,
  getNurseSessions,
  getRecentVisits,
  getNurseReviews
} from '../controllers/nurseDashboardController.js';

import {
  register,
  getNurseById,
  updateNurse,
  deleteNurse,
  getNursesBySpeciality,
  searchNurses,
  addReview,
  getNurseReviews as getNurseReviewsPublic,
  getNurseCompletedSessions,
  getUnconfirmedNurses,
  confirmNurse,
  updateNurseAvailability,
  updateNurseStatus
} from '../controllers/nurseController.js';
import upload from '../middlewares/uploadImage.js';
import { nurseValidation } from "../validations/nurseValidation.js";
import nurseMiddleware from '../middlewares/nurseMiddleware.js';
import { verifyToken } from "../middlewares/authMiddleware.js";
import { autoPermission } from '../middlewares/autoPermissions.js';

router.use(verifyToken);
router.use(autoPermission("patient")); 

router.get('/nurses', getAllNurses);
router.get('/servicesCount', getServicesCount);

router.get('/unconfirmed', getUnconfirmedNurses);
router.put('/confirm/:id',  confirmNurse);
router.delete('/delete/:nurseId', deleteNurse);

// 🟢 Routes app

router.get('/nursePatients/:nurseId', nurseMiddleware, getPatientsForNurse);
router.get('/nurseEarnings/:nurseId', nurseMiddleware, getNurseEarnings);
router.get('/nurseSessions/:nurseId', nurseMiddleware, getNurseSessions);
router.get('/nurseRecentVisits/:nurseId', nurseMiddleware, getRecentVisits);
router.get('/nurseReviews/:nurseId', nurseMiddleware, getNurseReviews);
router.get('/bySpecialty/:serviceId', getNursesBySpeciality);


// 🟢 Routes عامة لأي مستخدم

router.get('/search', search);
router.get('/getNurse/:nurseId', getNurseById);
router.get("/NumOfSessions/:nurseId", getNurseCompletedSessions);
router.post('/reviews/:nurseId', nurseMiddleware, addReview);
router.get("/reviews/:nurseId", getNurseReviewsPublic); // public reviews

router.post('/register',
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cv", maxCount: 1 }
  ]),
  nurseValidation(false),
  nurseMiddleware,
  register
);

router.patch('/update/:nurseId', upload.single("image"), nurseMiddleware, updateNurse);
router.patch('/updateNurseAvailability/:nurseId', nurseMiddleware, updateNurseAvailability);
router.patch('/updateNurseStatus/:nurseId', nurseMiddleware, updateNurseStatus);

export default router;


