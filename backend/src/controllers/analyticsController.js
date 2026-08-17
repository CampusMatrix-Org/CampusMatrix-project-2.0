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

/**
 * @desc    Get user academic analytics
 * @route   GET /api/v1/analytics/me
 */
export const getAnalytics = async (req, res) => {
  try {
    let stats = await Analytics.findOne({ userId: req.user.id });

    if (!stats) {
      stats = await Analytics.create({
        userId: req.user.id,
        gpa: 3.65,
        gpaTrend: [
          { name: "Sem 1", gpa: 3.4 },
          { name: "Sem 2", gpa: 3.55 },
          { name: "Sem 3", gpa: 3.65 }
        ],
        studyDistribution: [
          { name: "Coding", hours: 25 },
          { name: "Theory", hours: 15 },
          { name: "Revision", hours: 10 }
        ],
        strengthsWeaknesses: [
          { title: "Data Structures", desc: "Strong performance", val: 88, color: "#10B981" },
          { title: "Mathematics", desc: "Needs attention", val: 62, color: "#EF4444" }
        ]
      });
    }

    res.status(200).json({
      overallGpa: stats.gpa,
      gpaTrend: stats.gpaTrend,
      studyDistribution: stats.studyDistribution,
      strengthsWeaknesses: stats.strengthsWeaknesses,
      workload: {
        deadlines: 4,
        intensity: "Moderate",
        difficulty: "Medium"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};