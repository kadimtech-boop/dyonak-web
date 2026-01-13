import { db } from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
    const data = await db.get();
    res.json(data.expenses);
});

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
    const { amount, category, note } = req.body;

    const newExpense = {
        id: Date.now(),
        amount: Number(amount),
        category,
        note,
        date: new Date().toISOString()
    };

    await db.update(async (data) => {
        data.expenses.push(newExpense);
        return data;
    });

    res.status(201).json(newExpense);
});

export { getExpenses, addExpense };
