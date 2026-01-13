import { db } from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all clients/suppliers
// @route   GET /api/clients
// @access  Private
const getClients = asyncHandler(async (req, res) => {
    const type = req.query.type; // 'client' or 'supplier'
    const data = await db.get();

    if (type) {
        return res.json(data.clients.filter(c => c.type === type));
    }
    res.json(data.clients);
});

// @desc    Add new client
// @route   POST /api/clients
// @access  Private
const addClient = asyncHandler(async (req, res) => {
    const { name, phone, type, initialBalance } = req.body;

    const newClient = {
        id: Date.now(),
        name,
        phone,
        type: type || 'client',
        balance: Number(initialBalance) || 0,
        createdAt: new Date().toISOString()
    };

    await db.update(async (data) => {
        data.clients.push(newClient);
        return data;
    });

    res.status(201).json(newClient);
});

export { getClients, addClient };
