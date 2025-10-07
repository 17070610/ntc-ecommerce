import express from 'express';
import { protect, adminOnly, checkPermission } from '../middleware/auth.js';
import Product from '../models/Product.js'; // ✅ Add this import

const router = express.Router();

// Public routes - anyone can view products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            data: products,
            message: 'Products retrieved successfully'
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product,
            message: 'Product retrieved successfully'
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Protected routes - Admin only
router.post('/', protect, adminOnly, checkPermission('canManageProducts'), async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, image, isNew, tags } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, description, price, and category'
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            originalPrice,
            category,
            image,
            isNew: isNew || false,
            tags: tags || []
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.put('/:id', protect, adminOnly, checkPermission('canManageProducts'), async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, image, isNew, tags } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, originalPrice, category, image, isNew, tags },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ✅ FIXED DELETE ROUTE
router.delete('/:id', protect, adminOnly, checkPermission('canManageProducts'), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;