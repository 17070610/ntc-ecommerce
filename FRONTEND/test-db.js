const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://cyusac:c12345678@cluster0.tpytjlc.mongodb.net/ntc_ecommerce?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });