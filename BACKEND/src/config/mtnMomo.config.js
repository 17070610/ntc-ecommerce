import dotenv from 'dotenv';
dotenv.config();

const mtnMomoConfig = {
  environment: process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
  baseUrl: process.env.MTN_MOMO_BASE_URL || 'https://sandbox.momodeveloper.mtn.com',
  subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
  apiUser: process.env.MTN_MOMO_API_USER,
  apiKey: process.env.MTN_MOMO_API_KEY,
  callbackHost: process.env.MTN_MOMO_CALLBACK_HOST || 'https://webhook.site',
  mockMode: process.env.MTN_MOMO_MOCK_MODE === 'true' || false,
  currency: 'RWF',
  targetEnvironment: 'sandbox',
  tokenExpiry: 3600,
  timeout: 30000,
  
  isValid() {
    if (this.mockMode) return true;
    return !!(this.subscriptionKey && this.apiUser && this.apiKey);
  },
  
  hasPlaceholderCredentials() {
    return this.apiUser === 'sandbox' || this.apiKey === 'sandbox';
  }
};

if (!mtnMomoConfig.mockMode && !mtnMomoConfig.isValid()) {
  console.warn('MTN MoMo credentials not configured. Running in MOCK MODE.');
  mtnMomoConfig.mockMode = true;
}

if (mtnMomoConfig.hasPlaceholderCredentials() && !mtnMomoConfig.mockMode) {
  console.warn('Placeholder credentials detected. Enabling MOCK MODE.');
  mtnMomoConfig.mockMode = true;
}

export default mtnMomoConfig;
