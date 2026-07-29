/**
 * MongoDB Connection Configuration (Mongoose)
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/route_finder';
        const conn = await mongoose.connect(mongoURI);
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

        // Trigger automatic seeder check
        const seedSampleData = require('../utils/seeder');
        await seedSampleData();

    } catch (error) {
        console.warn(`[Database Warning] Could not connect to MongoDB (${error.message}). App will fallback to memory graph for demonstration.`);
    }
};

module.exports = connectDB;
