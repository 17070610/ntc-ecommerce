import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("⚠️ Please define the MONGODB_URI in .env.local");
}

// Extend global type so TS knows we cache mongoose
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
