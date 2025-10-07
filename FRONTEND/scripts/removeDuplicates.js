const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function removeDuplicates() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('products');

    const products = await collection.find({}).sort({ createdAt: -1 }).toArray();
    const seen = new Map();
    const toDelete = [];

    for (const product of products) {
        const key = `${product.name}-${product.price}`;
        if (seen.has(key)) {
            toDelete.push(product._id);
        } else {
            seen.set(key, product._id);
        }
    }

    if (toDelete.length > 0) {
        await collection.deleteMany({ _id: { $in: toDelete } });
        console.log(`✅ Deleted ${toDelete.length} duplicate products`);
    } else {
        console.log('✅ No duplicates found');
    }

    await mongoose.connection.close();
    process.exit(0);
}

removeDuplicates();