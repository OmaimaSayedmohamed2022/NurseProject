import express from 'express'
import  { getAllRequests, getRequestById,
          createRequest, updateRequest, 
          deleteRequest } from '../controllers/requestsController.js';

const router = express.Router();

router.get('/getAll', getAllRequests);
router.get('/getById/:id', getRequestById);
router.post('/create', createRequest);
router.put('/update/:id', updateRequest);
router.delete('/delete/:id', deleteRequest);


export default router;