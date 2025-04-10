import express from 'express';
import { 
  getAppointmentsCount, 
  getNewPatientsCount, 
  getNursesByStatus, 
  getTotalEarnings,  
  getClientsActivity, 
  getPatientVisitsByGender,
  getClientsMostRecentAnalysis, 
  getTestsDistribution, 
  getAvailableNurses 
} from '../controllers/homeDashboardController.js'; 

const router = express.Router();


// Appointments
router.get('/appointments/count', getAppointmentsCount);

// Clients Status
router.get('/newClients', getNewPatientsCount);

// Nurses Status
router.get('/nurses/status', getNursesByStatus);

// Total Earnings
router.get('/earnings', getTotalEarnings);

// Clients Activity
router.get('/clientsActivity', getClientsActivity);

// Clients Activity
router.get('/patientVisitsByGender', getPatientVisitsByGender);

// Clients Most Recent Analysis
router.get('/clientsRecentAnalysis', getClientsMostRecentAnalysis);

// Tests Distribution
router.get('/testsDistribution', getTestsDistribution);

// Available Nurses
router.get('/availableNurses', getAvailableNurses);

export default router;
