import User from '../models/User.js';

// GET /users/me/preferences
export const getMyPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json(user.preferences);
  } catch (error) {
    console.error('GET PREFERENCES ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// PUT /users/me/preferences
export const updateMyPreferences = async (req, res) => {
  try {
    const { theme, language, emailNotifications, pushNotifications } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.preferences) {
      user.preferences = {};
    }

    if (theme !== undefined) {
      user.preferences.theme = theme;
    }

    if (language !== undefined) {
      user.preferences.language = language;
    }

    if (emailNotifications !== undefined) {
      user.preferences.emailNotifications = emailNotifications;
    }

    if (pushNotifications !== undefined) {
      user.preferences.pushNotifications = pushNotifications;
    }

    await user.save();

    res.status(200).json({
      theme: user.preferences.theme,
      language: user.preferences.language,
      emailNotifications: user.preferences.emailNotifications,
      pushNotifications: user.preferences.pushNotifications
    });
  } catch (error) {
    console.error('UPDATE PREFERENCES ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};