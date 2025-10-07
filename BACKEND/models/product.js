import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: 0
        },
        image: {
            type: String,
            default: '/placeholder.svg'
        },
        category: {
            type: String,
            required: [true, 'Please add a category']
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        isNew: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Product', ProductSchema);