import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log(' Connected to MongoDB for admin seeding...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@campusmatrix.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminFullName = process.env.ADMIN_NAME || 'System Administrator';

    let admin = await User.findOne({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    if (admin) {
      admin.role = 'Admin';
      admin.status = 'Active';
      admin.fullName = adminFullName;
      admin.password = hashedPassword;
      await admin.save();
      console.log(` Existing user updated to Admin role successfully!`);
    } else {
      admin = await User.create({
        fullName: adminFullName,
        email: adminEmail,
        password: hashedPassword,
        role: 'Admin',
        status: 'Active',
        bio: 'CampusMatrix System Administrator'
      });
      console.log(` New Admin account created successfully!`);
    }

    console.log('-------------------------------------------');
    console.log(` Email:    ${adminEmail}`);
    console.log(` Password: ${adminPassword}`);
    console.log(` Role:     ${admin.role}`);
    console.log('-------------------------------------------');

    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
