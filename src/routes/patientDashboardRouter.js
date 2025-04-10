import express from 'express';
import { search, getAllClients} from '../controllers/patientDashboardController.js';

const router = express.Router();

router.get('/search', search);

router.get('/clients', getAllClients);


export default router;
