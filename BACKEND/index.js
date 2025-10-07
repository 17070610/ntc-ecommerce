import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// ================================
// Configuration
// ================================
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ntc-ecommerce";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ================================
// CORS Setup
// ================================
app.use(
    cors({
        origin: [CLIENT_URL, "http://localhost:3000", "http://localhost:5000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    })
);

// ================================
// Middleware
// ================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (images, uploads)
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================================
// MongoDB Connection
// ================================
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log(`✅ MongoDB Connected: ${mongoose.connection.db.databaseName}`))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.log("🔧 Check your MONGODB_URI in .env");
    });

// ================================
// Import Routes
// ================================
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/products.js";
import checkoutRoutes from "./routes/checkout.js"; // ✅ NEW
import paymentRoutes from './src/routes/paymentRoutes.js';
import orderRoutes from "./routes/orders.js";

// ================================
// Register Routes
// ================================
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes registered at /api/auth");

app.use("/api/cart", cartRoutes);
console.log("✅ Cart routes registered at /api/cart");

app.use("/api/admin", adminRoutes);
console.log("✅ Admin routes registered at /api/admin");

app.use("/api/products", productRoutes);
console.log("✅ Product routes registered at /api/products");

app.use("/api/checkout", checkoutRoutes);
console.log("✅ Checkout routes registered at /api/checkout");

app.use("/api/payments", paymentRoutes);
console.log("✅ Payment routes registered at /api/payments");

app.use("/api/orders", orderRoutes);
console.log("✅ Order routes registered at /api/orders");

// ================================
// Test & Health Routes
// ================================
app.post("/api/test/register", (req, res) => {
    res.json({
        success: true,
        message: "Test route working - no auth middleware",
        receivedData: req.body,
        timestamp: new Date().toISOString(),
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    });
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "NTC E-commerce API is running!",
        version: "2.0.0",
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    });
});

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "NTC E-commerce API",
        availableRoutes: [
            "GET /",
            "GET /api",
            "GET /api/health",
            "",
            "📝 Auth Routes:",
            "POST /api/auth/register",
            "POST /api/auth/login",
            "POST /api/auth/logout",
            "GET /api/auth/me",
            "PUT /api/auth/updatedetails",
            "PUT /api/auth/updatepassword",
            "",
            "🛒 Cart Routes (Protected):",
            "GET /api/cart",
            "POST /api/cart",
            "PUT /api/cart/:itemId",
            "DELETE /api/cart/:itemId",
            "DELETE /api/cart",
            "",
            "📦 Product Routes:",
            "GET /api/products (Public)",
            "GET /api/products/:[id] (Public)",
            "🔒 POST /api/products (Admin only)",
            "🔒 PUT /api/products/:[id] (Admin only)",
            "🔒 DELETE /api/products/:[id] (Admin only)",
            "",
            "💳 Checkout Routes:",
            "POST /api/checkout",
            "",
            "👑 Admin Routes (SuperAdmin only):",
            "GET /api/admin/users",
            "GET /api/admin/users/:[id]",
            "POST /api/admin/create-admin",
            "PUT /api/admin/users/:[id]/role",
            "PUT /api/admin/users/:[id]/activate",
            "PUT /api/admin/users/:[id]/deactivate",
            "DELETE /api/admin/users/:[id]",
        ],
    });
});

// ================================
// Error Handling
// ================================
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ================================
// Start Server
// ================================
app.listen(PORT, () => {
    console.log("🚀 =================================");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("🚀 =================================");
    console.log("📡 API Endpoints:");
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/api`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   🔒 GET  http://localhost:${PORT}/api/cart (Protected)`);
    console.log(`   🔒 POST http://localhost:${PORT}/api/products (Admin)`);
    console.log(`   💳 POST http://localhost:${PORT}/api/payments/initiate`);
    console.log(`   💳 POST http://localhost:${PORT}/api/checkout`);
    console.log(`   👑 POST http://localhost:${PORT}/api/admin/create-admin (SuperAdmin)`);
    console.log(`   👑 GET  http://localhost:${PORT}/api/admin/users (SuperAdmin)`);
    console.log("🚀 =================================");

    // Show payment mode status
    const mockMode = process.env.MTN_MOMO_MOCK_MODE === "true";
    console.log(`💳 MTN MoMo Payment Mode: ${mockMode ? "🧪 MOCK MODE (Testing)" : "✅ LIVE MODE"}`);
    if (mockMode) {
        console.log("   ⚠️  Running in mock mode - payments will be simulated");
        console.log("   ⚠️  Set MTN_MOMO_MOCK_MODE=false when credentials are ready");
    }
    console.log("🚀 =================================");
});
