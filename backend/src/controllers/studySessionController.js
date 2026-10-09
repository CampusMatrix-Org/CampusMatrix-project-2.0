import StudySession from '../models/StudySession.js';
import Task from '../models/Task.js';

const ALLOWED_FIELDS = [
  'mode', 'durationMinutes', 'startedAt', 'endedAt', 'completed', 'relatedTaskId'
];

const pickFields = (body) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key)));

const handleError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: 'Server error' });
};

// Minutes -> "2h 30m"
const formatMinutes = (total) => {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export const createStudySession = async (req, res) => {
  try {
    const data = pickFields(req.body);

    if (data.relatedTaskId) {
      const task = await Task.findOne({ _id: data.relatedTaskId, userId: req.user.id });
      if (!task) {
        return res.status(400).json({ success: false, message: 'relatedTaskId is invalid' });
      }
    }

    const session = await StudySession.create({ ...data, userId: req.user.id });
    res.status(201).json({
      success: true,
      message: 'Study session created successfully',
      data: session
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getStudySessions = async (req, res) => {
  try {
    const { mode } = req.query;
    const filter = { userId: req.user.id };
    if (mode) filter.mode = mode;

    const sessions = await StudySession.find(filter)
      .populate('relatedTaskId', 'title')
      .sort({ startedAt: -1 });

    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Study session not found' });
    }
    res.status(200).json({ success: true, message: 'Study session deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};


export const getStudySessionStats = async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user.id, completed: true });

    const focus = sessions.filter((s) => s.mode === 'focus');
    const breaks = sessions.filter((s) => s.mode !== 'focus');
    const sum = (list) => list.reduce((total, s) => total + s.durationMinutes, 0);

    res.status(200).json({
      success: true,
      data: {
        totalSessions: sessions.length,
        focusSessionsCount: focus.length,
        totalFocusMinutes: sum(focus),
        totalBreakMinutes: sum(breaks)
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Contract: GET /focus/stats -> { totalFocused, sessionsToday, streakDays }
export const getFocusStats = async (req, res) => {
  try {
    const focus = await StudySession.find({
      userId: req.user.id,
      mode: 'focus',
      completed: true
    }).select('durationMinutes startedAt');

    const totalMinutes = focus.reduce((total, s) => total + s.durationMinutes, 0);

    const days = new Set(focus.map((s) => dayKey(s.startedAt)));
    const today = new Date();

    const sessionsToday = focus.filter((s) => dayKey(s.startedAt) === dayKey(today)).length;

    let streakDays = 0;
    const cursor = new Date(today);
    if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (days.has(dayKey(cursor))) {
      streakDays++;
      cursor.setDate(cursor.getDate() - 1);
    }

    res.status(200).json({
      success: true,
      data: {
        totalFocused: formatMinutes(totalMinutes),
        sessionsToday,
        streakDays
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};