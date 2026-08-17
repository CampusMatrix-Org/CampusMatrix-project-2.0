import Analytics from '../models/Analytics.js';

/**
 * @desc    Get user dashboard stats
 * @route   GET /api/v1/dashboard/me
 */
export const getDashboardStats = async (req, res) => {
  try {
    let stats = await Analytics.findOne({ userId: req.user.id });

    if (!stats) {
      stats = await Analytics.create({
        userId: req.user.id,
        gpa: 3.65,
        credits: 18,
        goals: [
          { title: "Complete Software Architecture", progress: "80%", color: "#3B82F6" },
          { title: "Review Network Security", progress: "50%", color: "#10B981" }
        ]
      });
    }

    res.status(200).json({
      gpa: stats.gpa,
      credits: stats.credits,
      pendingAssignments: 3,
      goals: stats.goals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};