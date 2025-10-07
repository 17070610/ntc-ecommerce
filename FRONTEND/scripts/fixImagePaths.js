// scripts/fixImagePaths.js
const mongoose = require('mongoose');

// Your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ntc_ecommerce';

async function fixImagePaths() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const productsCollection = db.collection('products');

        // Find all products with absolute paths
        const products = await productsCollection.find({}).toArray();
        console.log(`📦 Found ${products.length} products`);

        let updatedCount = 0;

        for (const product of products) {
            let needsUpdate = false;
            let newImage = product.image;

            if (!product.image) {
                continue; // Skip products without images
            }

            // Remove extra quotes if present
            if (newImage.startsWith('"') && newImage.endsWith('"')) {
                newImage = newImage.slice(1, -1);
                needsUpdate = true;
            }

            // Fix escaped backslashes
            if (newImage.includes('\\\\')) {
                newImage = newImage.replace(/\\\\/g, '/');
                needsUpdate = true;
            }

            // Fix single backslashes
            if (newImage.includes('\\')) {
                newImage = newImage.replace(/\\/g, '/');
                needsUpdate = true;
            }

            // Fix absolute Windows paths - extract filename only
            if (newImage.includes('C:/Users') || newImage.includes('C:\\Users')) {
                // Extract just the filename from the path
                const filename = newImage.split(/[/\\]/).pop();
                newImage = '/' + filename;
                needsUpdate = true;
            }

            // Fix uploads path (if stored as relative path)
            if (newImage.startsWith('uploads/')) {
                newImage = '/' + newImage;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await productsCollection.updateOne(
                    { _id: product._id },
                    { $set: { image: newImage } }
                );
                console.log(`✅ Updated: ${product.name}`);
                console.log(`   Old: ${product.image}`);
                console.log(`   New: ${newImage}`);
                updatedCount++;
            }
        }

        console.log(`\n🎉 Migration complete! Updated ${updatedCount} products.`);

        // Show all current image paths
        const updatedProducts = await productsCollection.find({}).toArray();
        console.log('\n📋 Current image paths:');
        updatedProducts.forEach(p => {
            console.log(`   ${p.name}: ${p.image}`);
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
    }
}

fixImagePaths();