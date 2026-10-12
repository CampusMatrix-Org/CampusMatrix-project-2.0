import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
<<<<<<< HEAD
import adminRoutes from './routes/adminRoutes.js';
import { sanitizeInputs } from './middlewares/validateMiddleware.js';
import { apiLimiter } from './middlewares/rateLimitMiddleware.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
=======
import aiRoutes from './routes/aiRoutes.js'; 
import libraryRoutes from './routes/libraryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
>>>>>>> feat/api-v2-alignment

dotenv.config();

const app = express();

// Security HTTP headers
app.use(helmet());

<<<<<<< HEAD
// Cross-Origin Resource Sharing
app.use(cors());

// Body parser
app.use(express.json({ limit: '10mb' }));

// Input sanitization against NoSQL injection
app.use(sanitizeInputs);

// General API rate limiter
app.use('/api/v1', apiLimiter);

// Connect Database
=======
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

>>>>>>> feat/api-v2-alignment
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
<<<<<<< HEAD
app.use('/api/v1/admin', adminRoutes);
=======
app.use('/api/v1/ai', aiRoutes); 
app.use('/api/v1/flashcards', flashcardRoutes);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/focus', analyticsRoutes);
app.use('/api/v1/notifications', notificationRoutes);
>>>>>>> feat/api-v2-alignment

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