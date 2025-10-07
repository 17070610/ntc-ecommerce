// BACKEND/scripts/testMTNMoMo.js
// Test MTN MoMo API Connection

require('dotenv').config();
const axios = require('axios');

async function testMTNMoMoConnection() {
    // Load from .env file
    const config = {
        subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
        apiUser: process.env.MTN_MOMO_API_USER,
        apiKey: process.env.MTN_MOMO_API_KEY,
        baseUrl: process.env.MTN_MOMO_BASE_URL || 'https://sandbox.momodeveloper.mtn.com'
    };

    console.log('\n🧪 Testing MTN MoMo Connection...\n');
    console.log('Subscription Key:', config.subscriptionKey);
    console.log('API User:', config.apiUser);
    console.log('Base URL:', config.baseUrl);

    // Validate credentials
    if (!config.subscriptionKey || !config.apiUser || !config.apiKey) {
        console.log('\n❌ ERROR: Missing credentials in .env file!');
        console.log('\nPlease ensure your .env file has:');
        console.log('- MTN_MOMO_SUBSCRIPTION_KEY');
        console.log('- MTN_MOMO_API_USER');
        console.log('- MTN_MOMO_API_KEY');
        console.log('\nRun: node scripts/setupMTNMoMo.js first');
        process.exit(1);
    }

    if (config.apiUser === 'sandbox' || config.apiKey === 'sandbox') {
        console.log('\n⚠️  WARNING: You are using placeholder credentials!');
        console.log('Please run: node scripts/setupMTNMoMo.js');
        console.log('Or get real credentials from MTN MoMo Developer Portal');
        process.exit(1);
    }

    try {
        // Step 1: Get Access Token
        console.log('\n1️⃣  Getting access token...');

        const authString = Buffer.from(`${config.apiUser}:${config.apiKey}`).toString('base64');

        const tokenResponse = await axios.post(
            `${config.baseUrl}/collection/token/`,
            {},
            {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Ocp-Apim-Subscription-Key': config.subscriptionKey
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;
        console.log('✅ Access token obtained!');
        console.log('Token preview:', accessToken.substring(0, 30) + '...');

        // Step 2: Get Account Balance
        console.log('\n2️⃣  Checking account balance...');

        const balanceResponse = await axios.get(
            `${config.baseUrl}/collection/v1_0/account/balance`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Target-Environment': 'sandbox',
                    'Ocp-Apim-Subscription-Key': config.subscriptionKey
                }
            }
        );

        console.log('✅ Account balance retrieved!');
        console.log('Balance:', JSON.stringify(balanceResponse.data, null, 2));

        // Step 3: Check Account Status
        console.log('\n3️⃣  Checking account status...');

        const statusResponse = await axios.get(
            `${config.baseUrl}/collection/v1_0/accountholder/msisdn/250788123456/active`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Target-Environment': 'sandbox',
                    'Ocp-Apim-Subscription-Key': config.subscriptionKey
                }
            }
        );

        console.log('✅ Account status checked!');
        console.log('Result:', statusResponse.data);

        console.log('\n╔════════════════════════════════════════╗');
        console.log('║       ✅ ALL TESTS PASSED              ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('\n🎉 Your MTN MoMo integration is working correctly!');
        console.log('\n📚 Next steps:');
        console.log('1. Integration is ready for development');
        console.log('2. You can now implement payment features');
        console.log('3. Test payments in sandbox environment');

        return true;

    } catch (error) {
        console.log('\n╔════════════════════════════════════════╗');
        console.log('║       ❌ TEST FAILED                   ║');
        console.log('╚════════════════════════════════════════╝\n');

        if (error.response) {
            console.log('🔴 Status:', error.response.status);
            console.log('📄 Error:', JSON.stringify(error.response.data, null, 2));

            if (error.response.status === 401) {
                console.log('\n💡 Your credentials are invalid or expired.');
                console.log('   Run: node scripts/setupMTNMoMo.js');
            }
        } else {
            console.log('❌ Error:', error.message);
        }

        return false;
    }
}

// Run test
testMTNMoMoConnection()
    .then((success) => {
        process.exit(success ? 0 : 1);
    })
    .catch(() => {
        process.exit(1);
    });