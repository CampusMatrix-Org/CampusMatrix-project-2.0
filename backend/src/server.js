import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { sanitizeInputs } from './middlewares/validateMiddleware.js';
import { apiLimiter } from './middlewares/rateLimitMiddleware.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors());

// Body parser
app.use(express.json({ limit: '10mb' }));

// Input sanitization against NoSQL injection
app.use(sanitizeInputs);

// General API rate limiter
app.use('/api/v1', apiLimiter);

// Connect Database
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusMatrix API is running smoothly in production mode!'
  });
});

app.get('/', (req, res) => {
  res.send('CampusMatrix API is running...');
});

// Centralized 404 & Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});