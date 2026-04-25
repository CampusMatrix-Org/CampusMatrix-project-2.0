import StudySession from '../models/StudySession.js';

export const createStudySession = async (req, res) => {
  try {
    const {
      userId,
      mode,
      durationMinutes,
      startedAt,
      endedAt,
      completed,
      relatedTaskId
    } = req.body;

    if (!userId || !mode || !durationMinutes || !startedAt || !endedAt) {
      return res.status(400).json({
        success: false,
        message: 'userId, mode, durationMinutes, startedAt and endedAt are required'
      });
    }

    const session = await StudySession.create({
      userId,
      mode,
      durationMinutes,
      startedAt,
      endedAt,
      completed,
      relatedTaskId
    });

    res.status(201).json({
      success: true,
      message: 'Study session created successfully',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudySessions = async (req, res) => {
  try {
    const { userId, mode } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const filter = { userId };
    if (mode) filter.mode = mode;

    const sessions = await StudySession.find(filter)
      .populate('relatedTaskId', 'title')
      .sort({ startedAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudySessionStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const sessions = await StudySession.find({ userId, completed: true });

    const totalFocusMinutes = sessions
      .filter(session => session.mode === 'focus')
      .reduce((sum, session) => sum + session.durationMinutes, 0);

    const totalBreakMinutes = sessions
      .filter(session => session.mode === 'short-break' || session.mode === 'long-break')
      .reduce((sum, session) => sum + session.durationMinutes, 0);

    const totalSessions = sessions.length;

    const focusSessionsCount = sessions.filter(session => session.mode === 'focus').length;

    res.status(200).json({
      success: true,
      data: {
        totalSessions,
        focusSessionsCount,
        totalFocusMinutes,
        totalBreakMinutes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};