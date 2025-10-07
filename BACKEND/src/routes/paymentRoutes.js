// BACKEND/src/routes/paymentRoutes.js
import express from 'express';
import {
    initiatePayment,
    checkPaymentStatus,
    getAccountBalance,
    validatePhoneNumber
} from '../controllers/paymentController.js';

const router = express.Router();

// Initiate payment
router.post('/initiate', initiatePayment);

// Check payment status
router.get('/status/:referenceId', checkPaymentStatus);

// Get account balance (admin only - you might want to add auth middleware)
router.get('/balance', getAccountBalance);

// Validate phone number
router.post('/validate-phone', validatePhoneNumber);

export default router;