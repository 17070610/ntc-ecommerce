import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user cart and add item to cart
router.route('/')
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

// Update and remove specific cart items
router.route('/:itemId')
    .put(updateCartItem)
    .delete(removeFromCart);

export default router;