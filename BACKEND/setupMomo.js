import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

console.log('╔════════════════════════════════════════╗');
console.log('║   MTN MoMo API Setup - Rwanda          ║');
console.log('╚════════════════════════════════════════╝');

const SUBSCRIPTION_KEY = process.env.MTN_MOMO_SUBSCRIPTION_KEY;

if (!SUBSCRIPTION_KEY) {
    console.error('❌ Missing SUBSCRIPTION_KEY in .env');
    process.exit(1);
}

console.log(`\n✅ Subscription Key: ${SUBSCRIPTION_KEY}`);
console.log('🌍 Environment: Sandbox (Rwanda)');

const referenceId = uuidv4();
console.log(`🆔 Generated Reference ID: ${referenceId}\n`);

// CRITICAL: MTN MoMo requires the callback host to be a real domain
const CALLBACK_HOST = 'webhook.site';

(async () => {
    try {
        // ============================================
        // STEP 1: Create API User
        // ============================================
        console.log('📝 Step 1: Creating Sandbox API User...');

        const createResponse = await axios.post(
            'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser',
            {
                providerCallbackHost: CALLBACK_HOST
            },
            {
                headers: {
                    'X-Reference-Id': referenceId,
                    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
                    'Content-Type': 'application/json'
                },
                validateStatus: (status) => status === 201 || status === 409
            }
        );

        if (createResponse.status === 201) {
            console.log('✅ API User created successfully!');
        } else if (createResponse.status === 409) {
            console.log('⚠️  API User already exists (using existing)');
        }

        // ============================================
        // STEP 2: Wait for provisioning
        // ============================================
        console.log('\n⏳ Waiting 3 seconds for user provisioning...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // ============================================
        // STEP 3: Generate API Key
        // ============================================
        console.log('\n🔑 Step 2: Generating API Key...');

        const keyResponse = await axios.post(
            `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${referenceId}/apikey`,
            {},
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
                }
            }
        );

        const apiKey = keyResponse.data.apiKey;
        console.log('✅ API Key generated successfully!');

        // ============================================
        // STEP 4: Test the credentials
        // ============================================
        console.log('\n🧪 Step 3: Testing credentials with Collections API...');

        const authString = Buffer.from(`${referenceId}:${apiKey}`).toString('base64');

        const tokenResponse = await axios.post(
            'https://sandbox.momodeveloper.mtn.com/collection/token/',
            {},
            {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
                }
            }
        );

        if (tokenResponse.data.access_token) {
            console.log('✅ Access token obtained successfully!');
            console.log(`🎫 Token: ${tokenResponse.data.access_token.substring(0, 20)}...`);
        }

        // ============================================
        // SUCCESS - Display Credentials
        // ============================================
        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║              🎉 SETUP SUCCESSFUL! 🎉                   ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log('\n📋 Add these credentials to your .env file:\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`MTN_MOMO_API_USER=${referenceId}`);
        console.log(`MTN_MOMO_API_KEY=${apiKey}`);
        console.log('MTN_MOMO_CALLBACK_HOST=webhook.site');
        console.log('MTN_MOMO_ENVIRONMENT=sandbox');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('\n╔════════════════════════════════════════╗');
        console.error('║          ❌ SETUP FAILED               ║');
        console.error('╚════════════════════════════════════════╝\n');

        if (error.response) {
            console.error(`🔴 HTTP Status: ${error.response.status}`);
            console.error(`📄 Response:`, JSON.stringify(error.response.data, null, 2));

            console.log('\n💡 Troubleshooting Tips:\n');

            if (error.response.status === 401) {
                console.log('1️⃣  Your subscription key might be inactive or invalid');
                console.log('2️⃣  Verify your key at: https://momodeveloper.mtn.com/products');
                console.log('3️⃣  Ensure you\'re subscribed to "Collections" product');
                console.log('4️⃣  Check if your subscription is approved (may take 24-48 hours)');
            } else if (error.response.status === 404) {
                console.log('1️⃣  The API endpoint might have changed');
                console.log('2️⃣  Your account might not have sandbox access enabled');
                console.log('3️⃣  Try manual setup via the developer portal');
            } else if (error.response.status === 409) {
                console.log('1️⃣  This API User ID already exists');
                console.log('2️⃣  Run the script again to generate a new ID');
            }

            console.log('\n📚 Manual Setup Alternative:');
            console.log('   → Visit: https://momodeveloper.mtn.com/developer');
            console.log('   → Go to: Collections > User Provisioning');
            console.log('   → Generate credentials manually\n');

        } else if (error.request) {
            console.error('🔴 No response received from MTN API');
            console.error('   Check your internet connection');
        } else {
            console.error('🔴 Error:', error.message);
        }

        process.exit(1);
    }
})();