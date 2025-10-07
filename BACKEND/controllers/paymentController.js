// BACKEND/src/controllers/paymentController.js
// Payment Controller

import mtnMomoService from '../services/mtnMomoService.js';

export const initiatePayment = async (req, res) => {
    try {
        const { phoneNumber, amount, orderId, message } = req.body;

        // Validation
        if (!phoneNumber || !amount || !orderId) {
            return res.status(400).json({
                success: false,
                message: 'Phone number, amount, and order ID are required'
            });
        }

        // Validate phone number format
        if (!mtnMomoService.validatePhoneNumber(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Use 250XXXXXXXXX or 07XXXXXXXX'
            });
        }

        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }

        // Normalize phone number
        const normalizedPhone = mtnMomoService.normalizePhoneNumber(phoneNumber);

        // Check account status first (optional but recommended)
        const accountStatus = await mtnMomoService.checkAccountStatus(normalizedPhone);

        if (!accountStatus.result) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is not registered for MTN MoMo'
            });
        }

        // Initiate payment
        const paymentResult = await mtnMomoService.requestPayment(
            normalizedPhone,
            amount,
            orderId,
            message || `Payment for order ${orderId}`
        );

        res.status(200).json({
            success: true,
            message: 'Payment initiated successfully',
            data: paymentResult
        });

    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to initiate payment'
        });
    }
};

export const checkPaymentStatus = async (req, res) => {
    try {
        const { referenceId } = req.params;

        if (!referenceId) {
            return res.status(400).json({
                success: false,
                message: 'Reference ID is required'
            });
        }

        const paymentStatus = await mtnMomoService.checkPaymentStatus(referenceId);

        res.status(200).json({
            success: true,
            data: paymentStatus
        });

    } catch (error) {
        console.error('Payment status check error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to check payment status'
        });
    }
};

export const getAccountBalance = async (req, res) => {
    try {
        const balance = await mtnMomoService.getAccountBalance();

        res.status(200).json({
            success: true,
            data: balance
        });

    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get account balance'
        });
    }
};

export const validatePhoneNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const isValid = mtnMomoService.validatePhoneNumber(phoneNumber);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        const normalizedPhone = mtnMomoService.normalizePhoneNumber(phoneNumber);
        const accountStatus = await mtnMomoService.checkAccountStatus(normalizedPhone);

        res.status(200).json({
            success: true,
            message: accountStatus.message,
            data: {
                phoneNumber: normalizedPhone,
                isValid: true,
                isActive: accountStatus.result
            }
        });

    } catch (error) {
        console.error('Phone validation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to validate phone number'
        });
    }
};