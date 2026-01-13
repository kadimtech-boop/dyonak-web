import { db } from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get Settings
// @route   GET /api/settings
// @access  Private
const getSettings = asyncHandler(async (req, res) => {
    const data = await db.get();
    res.json(data.settings);
});

// @desc    Update Settings
// @route   POST /api/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
    const newSettings = req.body;
    await db.update(async (data) => {
        data.settings = { ...data.settings, ...newSettings };
        return data;
    });
    res.json({ success: true });
});

export { getSettings, updateSettings };
