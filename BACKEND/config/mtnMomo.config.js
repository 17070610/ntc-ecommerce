// BACKEND/src/config/mtnMomo.config.js
// MTN MoMo Configuration

import dotenv from 'dotenv';
dotenv.config();

const mtnMomoConfig = {
    // Environment settings
    environment: process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
    baseUrl: process.env.MTN_MOMO_BASE_URL || 'https://sandbox.momodeveloper.mtn.com',

    // API Credentials
    subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
    apiUser: process.env.MTN_MOMO_API_USER,
    apiKey: process.env.MTN_MOMO_API_KEY,

    // Callback settings
    callbackHost: process.env.MTN_MOMO_CALLBACK_HOST || 'https://webhook.site',

    // Mock mode (set to true until MTN subscription is active)
    mockMode: process.env.MTN_MOMO_MOCK_MODE === 'true' || false,

    // Currency
    currency: 'RWF', // Rwandan Franc

    // Target environment
    targetEnvironment: 'sandbox',

    // Token expiry (in seconds)
    tokenExpiry: 3600,

    // Request timeout
    timeout: 30000,

    // Validate configuration
    isValid() {
        if (this.mockMode) {
            return true; // Mock mode doesn't need real credentials
        }
        return !!(this.subscriptionKey && this.apiUser && this.apiKey);
    },

    // Check if using placeholder credentials
    hasPlaceholderCredentials() {
        return this.apiUser === 'sandbox' || this.apiKey === 'sandbox';
    }
};

// Validate on load
if (!mtnMomoConfig.mockMode && !mtnMomoConfig.isValid()) {
    console.warn('⚠️  MTN MoMo credentials not configured. Running in MOCK MODE.');
    console.warn('   Set MTN_MOMO_MOCK_MODE=false when credentials are ready.');
    mtnMomoConfig.mockMode = true;
}

if (mtnMomoConfig.hasPlaceholderCredentials() && !mtnMomoConfig.mockMode) {
    console.warn('⚠️  Placeholder credentials detected. Enabling MOCK MODE.');
    mtnMomoConfig.mockMode = true;
}

export default mtnMomoConfig;