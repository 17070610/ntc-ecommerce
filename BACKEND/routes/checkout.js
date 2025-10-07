import express from "express";
import mtnMomoService from "../src/services/mtnMomoService.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { cartItems, totalAmount, userId, phoneNumber } = req.body;

        console.log("==============================================");
        console.log("Incoming Checkout Request");

        // Validation
        if (!cartItems || cartItems.length === 0) {
            console.log("Checkout failed: No items in cart");
            return res.status(400).json({
                success: false,
                message: "No items in cart",
            });
        }

        if (!phoneNumber) {
            console.log("Checkout failed: Phone number required");
            return res.status(400).json({
                success: false,
                message: "Phone number is required for payment",
            });
        }

        // Validate phone number format
        if (!mtnMomoService.validatePhoneNumber(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number format. Use 250XXXXXXXXX or 07XXXXXXXX",
            });
        }

        console.log("Checkout data received:");
        console.log("   User ID:", userId || "Guest");
        console.log("   Total Amount:", totalAmount, "RWF");
        console.log("   Items Count:", cartItems.length);
        console.log("   Phone Number:", phoneNumber);

        // Generate order ID
        const orderId = `ORD-${Date.now()}`;

        // Normalize phone number
        const normalizedPhone = mtnMomoService.normalizePhoneNumber(phoneNumber);

        // Check if account is active
        const accountStatus = await mtnMomoService.checkAccountStatus(normalizedPhone);

        if (!accountStatus.result) {
            console.log("Payment failed: Phone number not registered for MTN MoMo");
            return res.status(400).json({
                success: false,
                message: "Phone number is not registered for MTN MoMo",
            });
        }

        // Initiate payment
        console.log("Initiating MTN MoMo payment...");
        const paymentResult = await mtnMomoService.requestPayment(
            normalizedPhone,
            totalAmount,
            orderId,
            `Payment for ${cartItems.length} items`
        );

        // Save order to database
        const order = await Order.create({
            userId: userId || null,
            orderId,
            items: cartItems,
            totalAmount,
            paymentReference: paymentResult.referenceId,
            paymentStatus: paymentResult.status,
            phoneNumber: normalizedPhone
        });

        console.log("Order saved to database:", order._id);
        console.log("Payment initiated:", paymentResult.referenceId);
        console.log("Status:", paymentResult.status);
        console.log("==============================================");

        res.status(200).json({
            success: true,
            message: "Payment initiated successfully. Please check your phone to complete the payment.",
            data: {
                orderId,
                paymentStatus: paymentResult.status,
                paymentReference: paymentResult.referenceId,
                totalAmount,
                currency: paymentResult.currency,
                phoneNumber: normalizedPhone,
                mockMode: paymentResult.mockMode,
            },
        });

    } catch (error) {
        console.error("Checkout Error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Checkout failed",
        });
    }
});

// Check payment status and update order
router.get("/status/:referenceId", async (req, res) => {
    try {
        const { referenceId } = req.params;

        if (!referenceId) {
            return res.status(400).json({
                success: false,
                message: "Payment reference ID is required",
            });
        }

        const paymentStatus = await mtnMomoService.checkPaymentStatus(referenceId);

        // Update order status in database
        await Order.findOneAndUpdate(
            { paymentReference: referenceId },
            {
                paymentStatus: paymentStatus.status,
                status: paymentStatus.status === 'SUCCESSFUL' ? 'Processing' : 'Cancelled'
            }
        );

        res.status(200).json({
            success: true,
            data: paymentStatus,
        });

    } catch (error) {
        console.error("Status check error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to check payment status",
        });
    }
});

export default router;