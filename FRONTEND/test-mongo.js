const { MongoClient, ServerApiVersion } = require('mongodb');

// ✅ Updated with new password c12345678
const uri = "mongodb+srv://cyusac:c12345678@cluster0.tpytjlc.mongodb.net/ntc_ecommerce?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("ntc_ecommerce").command({ ping: 1 });
        console.log("✅ Connected! Pinged ntc_ecommerce database.");
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
