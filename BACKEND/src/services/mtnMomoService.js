import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import mtnMomoConfig from '../config/mtnMomo.config.js';

class MTNMoMoService {
  constructor() {
    this.config = mtnMomoConfig;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.config.mockMode) {
      return 'mock_access_token_12345';
    }

    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const authString = Buffer.from(`${this.config.apiUser}:${this.config.apiKey}`).toString('base64');
      const response = await axios.post(`${this.config.baseUrl}/collection/token/`, {}, {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey
        },
        timeout: this.config.timeout
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (this.config.tokenExpiry * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get MTN MoMo access token:', error.message);
      throw new Error('Failed to authenticate with MTN MoMo');
    }
  }

  async requestPayment(phoneNumber, amount, orderId, message = 'Payment for order') {
    const referenceId = uuidv4();

    if (this.config.mockMode) {
      console.log(`[MOCK] Payment request: ${phoneNumber}, ${amount} ${this.config.currency}`);
      return {
        referenceId,
        status: 'PENDING',
        phoneNumber,
        amount,
        currency: this.config.currency,
        orderId,
        message: 'Mock payment initiated. Will auto-succeed in 2 seconds.',
        mockMode: true
      };
    }

    try {
      const token = await this.getAccessToken();
      await axios.post(`${this.config.baseUrl}/collection/v1_0/requesttopay`, {
        amount: amount.toString(),
        currency: this.config.currency,
        externalId: orderId,
        payer: { partyIdType: 'MSISDN', partyId: phoneNumber },
        payerMessage: message,
        payeeNote: `Order ${orderId}`
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': this.config.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          'Content-Type': 'application/json'
        },
        timeout: this.config.timeout
      });

      return { referenceId, status: 'PENDING', phoneNumber, amount, currency: this.config.currency, orderId, mockMode: false };
    } catch (error) {
      console.error('MTN MoMo payment request failed:', error.message);
      throw new Error(error.response?.data?.message || 'Payment request failed');
    }
  }

  async checkPaymentStatus(referenceId) {
    if (this.config.mockMode) {
      return {
        referenceId,
        status: 'SUCCESSFUL',
        amount: '1000',
        currency: this.config.currency,
        financialTransactionId: `mock_${referenceId}`,
        reason: 'Mock payment completed',
        mockMode: true
      };
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${this.config.baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': this.config.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey
        },
        timeout: this.config.timeout
      });

      return {
        referenceId,
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency,
        financialTransactionId: response.data.financialTransactionId,
        reason: response.data.reason,
        mockMode: false
      };
    } catch (error) {
      console.error('Failed to check payment status:', error.message);
      throw new Error('Failed to check payment status');
    }
  }

  async checkAccountStatus(phoneNumber) {
    if (this.config.mockMode) {
      return { result: true, message: 'Mock account is active' };
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${this.config.baseUrl}/collection/v1_0/accountholder/msisdn/${phoneNumber}/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': this.config.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.config.subscriptionKey
        },
        timeout: this.config.timeout
      });

      return { result: response.data.result, message: response.data.result ? 'Account is active' : 'Account is not active' };
    } catch (error) {
      console.error('Failed to check account status:', error.message);
      return { result: false, message: 'Failed to verify account' };
    }
  }

  validatePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const patterns = [/^250[0-9]{9}$/, /^07[0-9]{8}$/, /^7[0-9]{8}$/];
    return patterns.some(pattern => pattern.test(cleaned));
  }

  normalizePhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('250')) return cleaned;
    if (cleaned.startsWith('07')) return '250' + cleaned.substring(1);
    if (cleaned.startsWith('7')) return '250' + cleaned;
    return cleaned;
  }
}

export default new MTNMoMoService();
