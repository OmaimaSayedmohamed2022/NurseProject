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
  getNurseReviews,
  getSessionPercentagePerSkill
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

// ✅ Dashboard/Admin Routes
router.get('/nurses', getAllNurses);
router.get('/servicesCount', getServicesCount);
router.get('/unconfirmed', getUnconfirmedNurses);
router.put('/confirm/:id', confirmNurse);
router.delete('/delete/:nurseId', deleteNurse);

// ✅ App-specific Nurse Routes
router.get('/nursePatients/:nurseId', nurseMiddleware, getPatientsForNurse);
router.get('/nurseEarnings/:nurseId', nurseMiddleware, getNurseEarnings);
router.get('/nurseSessions/:nurseId', nurseMiddleware, getNurseSessions);
router.get('/nurseRecentVisits/:nurseId', nurseMiddleware, getRecentVisits);
router.get('/nurseReviews/:nurseId', nurseMiddleware, getNurseReviews);
router.get('/nurseSkills/:nurseId', nurseMiddleware, getSessionPercentagePerSkill);

// ✅ Public Routes
router.get('/search', search);
router.get('/getNurse/:nurseId', getNurseById);
router.get('/NumOfSessions/:nurseId', getNurseCompletedSessions);
router.post('/reviews/:nurseId', nurseMiddleware, addReview);
router.get('/reviews/:nurseId', getNurseReviewsPublic);
router.get('/bySpecialty/:serviceId', getNursesBySpeciality);

// ✅ Registration & Updates
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


