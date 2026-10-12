import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';

// Middlewares (dev)
import { sanitizeInputs } from './middlewares/validateMiddleware.js';
import { apiLimiter } from './middlewares/rateLimitMiddleware.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Routes (dev)
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';

// Routes (Navindu)
import adminRoutes from './routes/adminRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import examRoutes from './routes/examRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import studySessionRoutes, { focusRouter } from './routes/studySessionRoutes.js';

dotenv.config();

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS
app.use(cors());

// Body parser
app.use(express.json({ limit: '10mb' }));

// NoSQL injection sanitization
app.use(sanitizeInputs);

// General API rate limiter
app.use('/api/v1', apiLimiter);

// Static uploads
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Connect Database
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/study-sessions', studySessionRoutes);
app.use('/api/v1/focus', focusRouter);          // Navindu: /focus/stats
app.use('/api/v1/admin', adminRoutes);

app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/flashcards', flashcardRoutes);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/focus', analyticsRoutes);      // dev: focus (fallback)
app.use('/api/v1/notifications', notificationRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusMatrix API is running smoothly!'
  });
});

app.get('/', (req, res) => {
  res.send('CampusMatrix API is running...');
});

// 404 + central error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});