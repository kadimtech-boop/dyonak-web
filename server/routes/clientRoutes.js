import express from 'express';
import { getClients, addClient } from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getClients)
    .post(protect, addClient);

export default router;
