import express from 'express';
import { getExpenses, addExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getExpenses)
    .post(protect, addExpense);

export default router;
