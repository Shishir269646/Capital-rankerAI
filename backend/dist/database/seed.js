"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../model/User"));
const database_1 = require("../config/database");
const logger_1 = require("../config/logger");
const env_1 = require("../config/env");
const seedUsers = async () => {
    logger_1.logger.info('Seeding users...');
    const defaultUser = {
        _id: new mongoose_1.default.Types.ObjectId(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        firm_name: 'Example VC Firm',
        role: 'investor',
        is_active: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
    };
    const adminUser = {
        _id: new mongoose_1.default.Types.ObjectId(),
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
    const existingJohn = await User_1.default.findOne({ email: defaultUser.email });
    const existingAdmin = await User_1.default.findOne({ email: adminUser.email });
    if (!existingJohn) {
        await User_1.default.create(defaultUser);
        logger_1.logger.info(`User '${defaultUser.email}' seeded.`);
    }
    else {
        logger_1.logger.info(`User '${defaultUser.email}' already exists.`);
    }
    if (!existingAdmin) {
        await User_1.default.create(adminUser);
        logger_1.logger.info(`Admin user '${adminUser.email}' seeded.`);
    }
    else {
        logger_1.logger.info(`Admin user '${adminUser.email}' already exists.`);
    }
    logger_1.logger.info('User seeding complete.');
};
const seedData = async () => {
    try {
        (0, env_1.loadEnv)();
        (0, env_1.validateEnv)();
        await (0, database_1.connectDatabase)();
        logger_1.logger.info('Database connected for seeding.');
        await seedUsers();
        logger_1.logger.info('All seeding completed successfully!');
    }
    catch (error) {
        logger_1.logger.error('Seeding failed:', error);
        process.exit(1);
    }
    finally {
        await (0, database_1.disconnectDatabase)();
        logger_1.logger.info('Database disconnected after seeding.');
    }
};
seedData();
//# sourceMappingURL=seed.js.map