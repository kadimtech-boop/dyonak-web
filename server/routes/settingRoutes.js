import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getSettings)
    .post(protect, updateSettings);

export default router;
