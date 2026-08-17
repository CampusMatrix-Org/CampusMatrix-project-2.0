import Notification from '../models/Notification.js';

/**
 * @desc    Get user notifications
 * @route   GET /api/v1/notifications
 */
export const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // Dummy sample data if none exist yet
    if (notifications.length === 0) {
      notifications = await Notification.create([
        {
          title: "Assignment Due Soon",
          desc: "Software Architecture report is due tomorrow.",
          time: "2h ago",
          type: "alert",
          read: false,
          userId: req.user.id
        },
        {
          title: "New Lecture Material",
          desc: "Slides uploaded for Network Security.",
          time: "5h ago",
          type: "academic",
          read: true,
          userId: req.user.id
        }
      ]);
    }

    const formatted = notifications.map(n => ({
      id: n._id,
      title: n.title,
      desc: n.desc,
      time: n.time,
      type: n.type,
      read: n.read
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};