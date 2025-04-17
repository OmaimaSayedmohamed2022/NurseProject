import express from 'express';
import { search, getServicesCount, getAllNurses, getPatientsForNurse,
    getNurseEarnings,
    getNurseSessions,
    getRecentVisits,
    getNurseReviews,
    getSessionPercentagePerSkill} from '../controllers/nurseDashboardController.js';
import nurseMiddleware from '../middlewares/nurseMiddleware.js';

const router = express.Router();

router.get('/search', search);

router.get('/servicesCount', getServicesCount);

router.get('/nurses', getAllNurses);

router.get('/nursePatients/:nurseId', nurseMiddleware, getPatientsForNurse);

router.get('/nurseEarnings/:nurseId', nurseMiddleware, getNurseEarnings);

router.get('/nurseSessions/:nurseId', nurseMiddleware, getNurseSessions);

router.get('/nurseRecentVisits/:nurseId', nurseMiddleware, getRecentVisits);

router.get('/nurseReviews/:nurseId', nurseMiddleware, getNurseReviews);

router.get('/nurseSkills/:nurseId', nurseMiddleware, getSessionPercentagePerSkill);

export default router;
