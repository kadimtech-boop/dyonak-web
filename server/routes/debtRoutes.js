import express from 'express';
import { getDebts, addDebt } from '../controllers/debtController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getDebts)
    .post(protect, addDebt);

export default router;
