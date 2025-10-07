// scripts/quickFix.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function quickFix() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const productsCollection = db.collection('products');

        // Fix the specific problematic product
        console.log('🔧 Fixing product with bad image path...');

        const result = await productsCollection.updateOne(
            { _id: new mongoose.Types.ObjectId('68d262843872114d16d98da6') },
            { $set: { image: '/wireless-computer-mouse.jpg' } }
        );

        console.log(`✅ Modified ${result.modifiedCount} product(s)`);

        // Verify the update
        const product = await productsCollection.findOne({
            _id: new mongoose.Types.ObjectId('68d262843872114d16d98da6')
        });

        if (product) {
            console.log('📦 Product name:', product.name);
            console.log('📦 Product image is now:', product.image);
        }

        // Show all products with their image paths
        console.log('\n📋 All product image paths:');
        const allProducts = await productsCollection.find({}).toArray();
        allProducts.forEach(p => {
            console.log(`   ${p.name}: ${p.image || '(no image)'}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

quickFix();