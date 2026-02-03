const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kongu_community";

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        const adminEmail = 'admin@kongu.edu';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            existingAdmin.role = 'ADMIN';
            // Only update password if needed, but let's reset it for convenience
            existingAdmin.password = 'admin123'; 
            await existingAdmin.save();
            console.log('Admin user updated successfully.');
        } else {
            const admin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'ADMIN',
                department: 'ADMIN',
                batchYear: 2024
            });
            await admin.save();
            console.log('Admin user created successfully.');
        }

        console.log('\n-----------------------------------');
        console.log('Admin Credentials:');
        console.log('Email: admin@kongu.edu');
        console.log('Password: admin123');
        console.log('-----------------------------------\n');

        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
