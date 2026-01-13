import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import debtRoutes from './routes/debtRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logger
app.use(express.json());

// Mount Routes
app.use('/api', authRoutes); // /api/login, /api/signup
app.use('/api/clients', clientRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/stats', statsRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('Dyonak Professional API is running...');
});

// Error Middlewares (Must be last)
app.use(notFound);
app.use(errorHandler);

// Only listen if run directly (Local Development)
if (process.env.NODE_ENV !== 'production' || process.env.VITE_API_URL === undefined) {
    app.listen(PORT, () => {
        console.log(`\n    🚀 Server running successfully on http://localhost:${PORT}`);
        console.log(`    🔒 Security Level: High (JWT + Helmet + Bcrypt)`);
        console.log(`    📝 Database: Async JSON`);
        console.log(`    🕒 Time: ${new Date().toLocaleTimeString()}\n`);
    });
}

export default app;
