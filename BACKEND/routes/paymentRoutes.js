// BACKEND/src/routes/paymentRoutes.js
import express from 'express';
import {
    initiatePayment,
    checkPaymentStatus,
    getAccountBalance,
    validatePhoneNumber
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.get('/status/:referenceId', checkPaymentStatus);
router.get('/balance', getAccountBalance);
router.post('/validate-phone', validatePhoneNumber);

export default router;