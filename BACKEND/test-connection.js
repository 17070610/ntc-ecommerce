const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('🔌 Testing MongoDB Atlas connection...');
        console.log('📍 Connection String:', process.env.MONGODB_URI ? 'Found in .env' : 'NOT FOUND in .env');

        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI not found in .env file');
            return;
        }

        // Show partial connection string (hide password)
        const uri = process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@');
        console.log('🔗 Connecting to:', uri);

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ MongoDB connected successfully!');
        console.log('📊 Database name:', mongoose.connection.db.databaseName);
        console.log('📡 Connection state:', mongoose.connection.readyState);
        console.log('🏠 Host:', mongoose.connection.host);

        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Available collections:', collections.length);

        await mongoose.disconnect();
        console.log('✅ Test completed successfully!');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);

        if (error.message.includes('Authentication failed')) {
            console.log('🔧 Check your username and password in the connection string');
        }
        if (error.message.includes('network timeout')) {
            console.log('🔧 Check your network access settings in MongoDB Atlas');
        }
        if (error.message.includes('ENOTFOUND')) {
            console.log('🔧 Check your cluster URL in the connection string');
        }
    }
}

testConnection();