import Task from '../models/Task.js';
import Exam from '../models/Exam.js';
import StudySession from '../models/StudySession.js';

const handleError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: 'Server error' });
};

const toTaskEvent = (task) => ({
  id: task._id.toString(),
  title: task.title,
  type: task.type || 'task',          // task / exam / lecture
  date: task.dueDate,
  priority: task.priority,
  status: task.status
});

const toExamEvent = (exam) => ({
  id: exam._id.toString(),
  title: exam.subject,
  type: 'exam',
  date: exam.examDate,
  priority: exam.priority,
  status: exam.status,
  targetGrade: exam.targetGrade
});

const toSessionEvent = (session) => ({
  id: session._id.toString(),
  title: `${session.mode} session`,
  type: 'study-session',
  date: session.startedAt,
  durationMinutes: session.durationMinutes,
  completed: session.completed
});

const byDate = (a, b) => new Date(a.date) - new Date(b.date);

// GET /calendar/events?month=10&year=2026  (month, year optional)
export const getCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    const taskFilter = { userId, dueDate: { $ne: null } };
    const examFilter = { userId };
    const sessionFilter = { userId };

    if (month || year) {
      const m = Number(month);
      const y = Number(year);

      if (!Number.isInteger(m) || m < 1 || m > 12 || !Number.isInteger(y) || y < 1970 || y > 2100) {
        return res.status(400).json({
          success: false,
          message: 'month (1-12) and year (e.g. 2026) must both be valid numbers'
        });
      }

      const startDate = new Date(Date.UTC(y, m - 1, 1));
      const endDate = new Date(Date.UTC(y, m, 1));

      taskFilter.dueDate = { $gte: startDate, $lt: endDate };
      examFilter.examDate = { $gte: startDate, $lt: endDate };
      sessionFilter.startedAt = { $gte: startDate, $lt: endDate };
    }

    const [tasks, exams, sessions] = await Promise.all([
      Task.find(taskFilter),
      Exam.find(examFilter),
      StudySession.find(sessionFilter)
    ]);

    const events = [
      ...tasks.map(toTaskEvent),
      ...exams.map(toExamEvent),
      ...sessions.map(toSessionEvent)
    ].sort(byDate);

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    handleError(res, error);
  }
};

// GET /calendar/upcoming?limit=5
export const getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 50);
    const now = new Date();

    const [tasks, exams] = await Promise.all([
      Task.find({ userId, dueDate: { $gte: now }, status: { $ne: 'completed' } })
        .sort({ dueDate: 1 })
        .limit(limit),
      Exam.find({ userId, examDate: { $gte: now }, status: { $ne: 'completed' } })
        .sort({ examDate: 1 })
        .limit(limit)
    ]);

    const upcoming = [...tasks.map(toTaskEvent), ...exams.map(toExamEvent)]
      .sort(byDate)
      .slice(0, limit);

    res.status(200).json({ success: true, count: upcoming.length, data: upcoming });
  } catch (error) {
    handleError(res, error);
  }
};