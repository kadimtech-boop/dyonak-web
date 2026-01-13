import { db } from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all debts
// @route   GET /api/debts
// @access  Private
const getDebts = asyncHandler(async (req, res) => {
    const data = await db.get();
    // Join with client details for display
    const debtsWithClient = data.debts.map(d => {
        const client = data.clients.find(c => c.id == d.clientId);
        return { ...d, clientName: client ? client.name : 'Unknown' };
    });
    res.json(debtsWithClient);
});

// @desc    Add new debt/transaction
// @route   POST /api/debts
// @access  Private
const addDebt = asyncHandler(async (req, res) => {
    const { amount, type, clientId, description } = req.body;

    const newDebt = {
        id: Date.now(),
        amount: Number(amount),
        type, // 'credit', 'debit', 'payment', 'receipt'
        clientId: Number(clientId),
        description,
        date: new Date().toISOString(),
        status: 'completed'
    };

    await db.update(async (data) => {
        data.debts.push(newDebt);

        // Update client balance logic
        const client = data.clients.find(c => c.id == clientId);
        if (client) {
            if (type === 'credit') client.balance += Number(amount);
            if (type === 'debit') client.balance -= Number(amount);
            if (type === 'payment') client.balance -= Number(amount); // Customer pays us
            if (type === 'receipt') client.balance += Number(amount); // We pay supplier
        }
        return data;
    });

    res.status(201).json(newDebt);
});

export { getDebts, addDebt };
