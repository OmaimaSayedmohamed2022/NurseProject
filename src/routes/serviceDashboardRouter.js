import express from 'express';
import { search, getAllServices} from '../controllers/serviceDashboardController.js';

const router = express.Router();

router.get('/search', search);

router.get('/services', getAllServices);


export default router;
