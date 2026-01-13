import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');

            // Get user from DB (Async)
            const data = await db.get();
            const user = data.users.find(u => u.id === decoded.id);

            if (!user) {
                return res.status(401).json({ message: 'المستخدم غير موجود' });
            }

            // Attach user to request (exclude password)
            const { password, ...userWithoutPassword } = user;
            req.user = userWithoutPassword;
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'غير مصرح: رمز الدخول غير صالح' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'غير مصرح: لا يوجد رمز دخول' });
    }
};

export { protect };
