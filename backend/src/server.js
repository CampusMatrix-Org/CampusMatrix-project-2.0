import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';

// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';

import taskRoutes from './routes/taskRoutes.js';
import examRoutes from './routes/examRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import studySessionRoutes from './routes/studySessionRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);

app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/study-sessions', studySessionRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusMatrix API is running smoothly!'
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});