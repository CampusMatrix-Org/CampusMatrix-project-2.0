import Task from '../models/Task.js';
import Exam from '../models/Exam.js';
import StudySession from '../models/StudySession.js';

export const getCalendarEvents = async (req, res) => {
  try {
    const { userId, month, year } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    let startDate = null;
    let endDate = null;

    if (month && year) {
      startDate = new Date(Number(year), Number(month) - 1, 1);
      endDate = new Date(Number(year), Number(month), 1);
    }

    const taskFilter = { userId };
    const examFilter = { userId };
    const sessionFilter = { userId };

    if (startDate && endDate) {
      taskFilter.dueDate = { $gte: startDate, $lt: endDate };
      examFilter.examDate = { $gte: startDate, $lt: endDate };
      sessionFilter.startedAt = { $gte: startDate, $lt: endDate };
    }

    const [tasks, exams, sessions] = await Promise.all([
      Task.find(taskFilter),
      Exam.find(examFilter),
      StudySession.find(sessionFilter)
    ]);

    const taskEvents = tasks
      .filter(task => task.dueDate)
      .map(task => ({
        id: task._id,
        title: task.title,
        type: 'task',
        date: task.dueDate,
        priority: task.priority,
        status: task.status
      }));

    const examEvents = exams.map(exam => ({
      id: exam._id,
      title: exam.subject,
      type: 'exam',
      date: exam.examDate,
      priority: exam.priority,
      status: exam.status,
      targetGrade: exam.targetGrade
    }));

    const sessionEvents = sessions.map(session => ({
      id: session._id,
      title: `${session.mode} session`,
      type: 'study-session',
      date: session.startedAt,
      durationMinutes: session.durationMinutes,
      completed: session.completed
    }));

    const events = [...taskEvents, ...examEvents, ...sessionEvents].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const now = new Date();

    const [tasks, exams] = await Promise.all([
      Task.find({
        userId,
        dueDate: { $gte: now },
        status: { $ne: 'completed' }
      }).sort({ dueDate: 1 }).limit(5),

      Exam.find({
        userId,
        examDate: { $gte: now },
        status: { $ne: 'completed' }
      }).sort({ examDate: 1 }).limit(5)
    ]);

    const upcomingTasks = tasks.map(task => ({
      id: task._id,
      title: task.title,
      type: 'task',
      date: task.dueDate,
      priority: task.priority,
      status: task.status
    }));

    const upcomingExams = exams.map(exam => ({
      id: exam._id,
      title: exam.subject,
      type: 'exam',
      date: exam.examDate,
      priority: exam.priority,
      status: exam.status
    }));

    const upcoming = [...upcomingTasks, ...upcomingExams].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.status(200).json({
      success: true,
      count: upcoming.length,
      data: upcoming
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};