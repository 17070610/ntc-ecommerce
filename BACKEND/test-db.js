import mongoose from "mongoose";

// your Atlas connection URI
const uri = "mongodb+srv://cyusac:c12345678@cluster0.tpytjlc.mongodb.net/ntc_ecommerce?retryWrites=true&w=majority";

// Define a sample schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    inStock: Boolean
});

const Product = mongoose.model("Product", productSchema);

try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB Atlas!");

    // Insert sample product
    const sampleProduct = new Product({
        name: "Test Product",
        price: 99.99,
        inStock: true
    });

    await sampleProduct.save();
    console.log("📦 Sample product inserted:", sampleProduct);

    await mongoose.connection.close();
} catch (err) {
    console.error("❌ Error:", err);
}
