// BACKEND/scripts/setupMTNMoMo.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const SUBSCRIPTION_KEY = '6ec24cf4c67d4b22943d5f240425ab96';
const BASE_URL = 'https://sandbox.momodeveloper.mtn.com';
const CALLBACK_HOST = 'https://webhook.site';

async function setupMTNMoMo() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║     MTN MoMo Manual Setup Script      ║');
  console.log('╚════════════════════════════════════════╝\n');

  const referenceId = uuidv4();
  console.log('🆔 Generated Reference ID:', referenceId);
  console.log('🔑 Subscription Key:', SUBSCRIPTION_KEY);

  try {
    console.log('\n📝 Step 1: Creating API User...');
    
    const createUserResponse = await axios.post(
      `${BASE_URL}/v1_0/apiuser`,
      { providerCallbackHost: CALLBACK_HOST },
      {
        headers: {
          'X-Reference-Id': referenceId,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (createUserResponse.status === 201) {
      console.log('✅ API User created successfully!');
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n🔐 Step 2: Creating API Key...');
    
    const createKeyResponse = await axios.post(
      `${BASE_URL}/v1_0/apiuser/${referenceId}/apikey`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
        }
      }
    );

    const apiKey = createKeyResponse.data.apiKey;
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║          ✅ SETUP SUCCESSFUL           ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log('📋 Copy these to your .env file:\n');
    console.log('MTN_MOMO_SUBSCRIPTION_KEY=' + SUBSCRIPTION_KEY);
    console.log('MTN_MOMO_API_USER=' + referenceId);
    console.log('MTN_MOMO_API_KEY=' + apiKey);
    console.log('MTN_MOMO_ENVIRONMENT=sandbox');
    console.log('MTN_MOMO_CALLBACK_HOST=' + CALLBACK_HOST);
    console.log('MTN_MOMO_BASE_URL=' + BASE_URL);

  } catch (error) {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║          ❌ SETUP FAILED               ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    if (error.response) {
      console.log('🔴 HTTP Status:', error.response.status);
      console.log('📄 Response:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.log('\n💡 Your subscription key is NOT ACTIVE.');
        console.log('   Use the manual web portal method:');
        console.log('   1. Go to https://momodeveloper.mtn.com/developer');
        console.log('   2. Collections → Sandbox User Provisioning');
        console.log('   3. Click Generate for API User and API Key');
      }
    } else {
      console.log('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

setupMTNMoMo();
