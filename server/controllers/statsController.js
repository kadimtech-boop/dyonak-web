import { db } from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get Dashboard Stats
// @route   GET /api/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
    const data = await db.get();
    const totalReceivable = data.clients.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);
    const totalPayable = data.clients.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0);

    // Calculate total revenue (payments received)
    const totalIncome = data.debts
        .filter(d => d.type === 'payment')
        .reduce((acc, d) => acc + d.amount, 0);

    // Calculate total expenses
    const totalExpenses = data.expenses.reduce((acc, e) => acc + e.amount, 0);

    // Calculate growth (mock logic based on last month)
    const growth = "15%";

    res.json({
        totalReceivable,
        totalPayable,
        clientCount: data.clients.length,
        alertCount: 0,
        totalIncome,
        totalExpenses,
        growth
    });
});

export { getStats };
