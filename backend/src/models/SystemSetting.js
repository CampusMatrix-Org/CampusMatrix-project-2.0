import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema(
  {
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    twoFactorAuth: {
      type: Boolean,
      default: false
    },
    dailyApiLimit: {
      type: Number,
      default: 1000000
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    geminiApiKeyMasked: {
      type: String,
      default: 'AIzaSyB_REDACTED_KEY_4X9Z'
    }
  },
  { timestamps: true }
);

const SystemSetting = mongoose.model('SystemSetting', systemSettingSchema);
export default SystemSetting;