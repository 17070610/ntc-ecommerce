import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const db = await dbConnect();
        const collections = await db.listCollections().toArray();

        return NextResponse.json({
            message: "Database connected successfully!",
            collections,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Database connection failed",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
