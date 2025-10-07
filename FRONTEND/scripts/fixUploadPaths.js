const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixUploadPaths() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Change /uploads/ to /public/uploads/ or just remove products with missing images
    await collection.updateMany(
        { image: { $regex: '^/uploads/' } },
        { $set: { image: '' } }  // Clear broken image paths
    );

    console.log('Cleared broken upload paths');
    await mongoose.connection.close();
    process.exit(0);
}

fixUploadPaths();