import mongoose from 'mongoose';

import User from '../model/User'; // Assuming User model is at ../model/User
import { connectDatabase, disconnectDatabase } from '../config/database'; // Assuming database connection utils
import { logger } from '../config/logger';
import { loadEnv, validateEnv } from '../config/env'; // Import loadEnv and validateEnv

const seedUsers = async () => {
  logger.info('Seeding users...');



  const defaultUser = {
    _id: new mongoose.Types.ObjectId(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    firm_name: 'Example VC Firm',
    role: 'investor', // Changed from 'user' to 'investor'
    is_active: true, // Corrected from isEmailVerified to is_active
    last_login: new Date(), // Corrected from lastLogin to last_login
    created_at: new Date(),
    updated_at: new Date(),
  };

  const adminUser = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    firm_name: 'Admin Corp',
    role: 'admin',
    is_active: true,
    last_login: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  // Check if users already exist to prevent duplicates
  const existingJohn = await User.findOne({ email: defaultUser.email });
  const existingAdmin = await User.findOne({ email: adminUser.email });

  if (!existingJohn) {
    await User.create(defaultUser);
    logger.info(`User '${defaultUser.email}' seeded.`);
  } else {
    logger.info(`User '${defaultUser.email}' already exists.`);
  }

  if (!existingAdmin) {
    await User.create(adminUser);
    logger.info(`Admin user '${adminUser.email}' seeded.`);
  } else {
    logger.info(`Admin user '${adminUser.email}' already exists.`);
  }

  logger.info('User seeding complete.');
};

const seedData = async () => {
  try {
    loadEnv(); // Load environment variables
    validateEnv(); // Validate environment variables

    await connectDatabase(); // Connect to MongoDB
    logger.info('Database connected for seeding.');

    await seedUsers();
    // Add other seeding functions here

    logger.info('All seeding completed successfully!');
  } catch (error: any) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase(); // Disconnect from MongoDB
    logger.info('Database disconnected after seeding.');
  }
};

seedData();
