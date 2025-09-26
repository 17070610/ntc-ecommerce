// Create this file: FRONTEND/app/api/debug-connection/route.ts
// Then visit: http://localhost:3000/api/debug-connection

import mongoose from 'mongoose';
import { NextResponse } from "next/server";

export async function GET() {
    const MONGODB_URI = process.env.MONGODB_URI;

    const debugInfo = {
        mongodbUri: MONGODB_URI ? 'Present' : 'Missing',
        mongodbUriLength: MONGODB_URI ? MONGODB_URI.length : 0,
        nodeEnv: process.env.NODE_ENV,
        mongooseVersion: mongoose.version,
    };

    // Mask the connection string for security but show structure
    if (MONGODB_URI) {
        const masked = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
        debugInfo.maskedUri = masked;

        // Check URI format
        debugInfo.isAtlasUri = MONGODB_URI.includes('mongodb+srv://');
        debugInfo.hasDatabase = MONGODB_URI.split('/').length > 3;
        debugInfo.hasCredentials = MONGODB_URI.includes('@');
    }

    try {
        console.log('Testing MongoDB connection...');

        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        // Test connection
        const connection = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        debugInfo.connectionStatus = 'SUCCESS';
        debugInfo.databaseName = connection.connection.db.databaseName;
        debugInfo.host = connection.connection.host;
        debugInfo.port = connection.connection.port;

        // List collections
        const collections = await connection.connection.db.listCollections().toArray();
        debugInfo.collections = collections.map(c => c.name);

        // Disconnect
        await mongoose.disconnect();

        return NextResponse.json({
            success: true,
            debug: debugInfo
        });

    } catch (error) {
        debugInfo.connectionStatus = 'FAILED';
        debugInfo.error = error.message;

        // Provide specific help based on error type
        if (error.message.includes('ENOTFOUND')) {
            debugInfo.helpMessage = 'DNS resolution failed. Check your internet connection and MongoDB Atlas cluster URL.';
        } else if (error.message.includes('authentication failed')) {
            debugInfo.helpMessage = 'Wrong username or password. Check your MongoDB Atlas Database Access settings.';
        } else if (error.message.includes('not authorized')) {
            debugInfo.helpMessage = 'User lacks permissions. Check MongoDB Atlas Database Access permissions.';
        }

        return NextResponse.json({
            success: false,
            debug: debugInfo,
            error: error.message
        }, { status: 500 });
    }
}