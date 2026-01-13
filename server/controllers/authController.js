import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import generateToken from '../utils/jwt.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Auth user & get token
// @route   POST /api/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const data = await db.get();
    const user = data.users.find(u => u.email === email);

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id)
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
};

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Simple Validation
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'يرجى ملء جميع الحقول' });
    }

    const data = await db.get();

    if (data.users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date()
    };

    await db.update(async (currentData) => {
        currentData.users.push(newUser);
        return currentData;
    });

    res.status(201).json({
        success: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser.id)
        }
    });
});

export { loginUser, registerUser };
