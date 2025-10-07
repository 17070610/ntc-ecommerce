// models/product.js
import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        category: { type: String },
        image: { type: String },
        rating: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 },
        // keep isNew for compatibility with frontend, suppress warning:
        isNew: { type: Boolean, default: false },
        tags: { type: [String], default: [] },
    },
    { timestamps: true, suppressReservedKeysWarning: true }
);

const Product = models.Product || mongoose.model("Product", ProductSchema);
export default Product;
