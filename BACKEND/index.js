const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Test route - Place this FIRST before other middleware
app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "NTC E-commerce API is running!",
        version: "1.0.0",
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ntc-ecommerce')
    .then(() => {
        console.log('✅ MongoDB Connected successfully');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('🔧 Please check your MONGODB_URI in .env file');
    });

// Import and use routes AFTER middleware setup
try {
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('✅ Auth routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading auth routes:', error.message);
    console.log('📁 Make sure you have created the routes/auth.js file');
}

// Test route to debug auth issues
app.post('/api/test/register', async (req, res) => {
    res.json({
        success: true,
        message: "Test route working - no auth middleware",
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// API routes info
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'NTC E-commerce API',
        availableRoutes: [
            'GET /',
            'GET /api',
            'GET /api/health',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'POST /api/auth/logout',
            'GET /api/auth/me',
            'POST /api/test/register'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler - COMPLETELY REMOVED THE PROBLEMATIC WILDCARD ROUTE
// Using standard Express 404 handling instead
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        availableRoutes: [
            'GET /',
            'GET /api',
            'GET /api/health',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'POST /api/auth/logout',
            'GET /api/auth/me',
            'POST /api/test/register'
        ]
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('🚀 =================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('🚀 =================================');
    console.log('📡 API Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/api`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   POST http://localhost:${PORT}/api/test/register (DEBUG)`);
    console.log('🚀 =================================');
});