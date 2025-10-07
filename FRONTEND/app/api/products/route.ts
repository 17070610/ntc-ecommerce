import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json({
            success: true,
            data: products,
            count: products.length,
        });
    } catch (err: any) {
        console.error("GET /api/products ERROR:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (body._id) {
            delete body._id;
        }

        if (body.image && body.image.includes("\\")) {
            body.image = body.image.split("public")[1] || body.image;
            body.image = body.image.replace(/\\/g, "/");
        }

        // Check for duplicates
        const existingProduct = await Product.findOne({
            name: body.name,
            price: body.price
        });

        if (existingProduct) {
            console.log("Duplicate detected, returning existing product");
            return NextResponse.json(
                { success: true, data: existingProduct, duplicate: true },
                { status: 200 }
            );
        }

        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (err: any) {
        console.error("POST /api/products ERROR:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Create failed" },
            { status: 400 }
        );
    }
}