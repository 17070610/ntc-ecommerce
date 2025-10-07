// BACKEND/scripts/createSuperAdmin.js
// Run this script ONCE to create your first super admin
// Usage: node scripts/createSuperAdmin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ntc-ecommerce";

const createSuperAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });

        if (existingSuperAdmin) {
            console.log('⚠️  Super admin already exists:');
            console.log('   Email:', existingSuperAdmin.email);
            console.log('   Name:', existingSuperAdmin.name);
            console.log('\n💡 If you forgot the password, delete this user from MongoDB and run this script again.');
            process.exit(0);
        }

        // Create super admin
        const superAdminData = {
            name: 'Super Admin',
            email: 'superadmin@ntc.com', // CHANGE THIS!
            password: 'SuperAdmin123!', // CHANGE THIS!
            role: 'superadmin'
        };

        const superAdmin = await User.create(superAdminData);

        console.log('\n🎉 ===================================');
        console.log('✅ Super Admin Created Successfully!');
        console.log('=====================================');
        console.log('📧 Email:', superAdminData.email);
        console.log('🔑 Password:', superAdminData.password);
        console.log('👤 Name:', superAdminData.name);
        console.log('🎭 Role:', superAdmin.role);
        console.log('=====================================');
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');
        console.log('⚠️  Delete this script or change the credentials in it!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating super admin:', error.message);
        process.exit(1);
    }
};

createSuperAdmin();