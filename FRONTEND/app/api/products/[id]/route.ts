import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

// GET single product by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        console.error("GET /api/products/[[id]] ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await req.json();
        const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
        if (!updated) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: updated });
    } catch (err: any) {
        console.error("PUT /api/products/[[id]] ERROR:", err);
        return NextResponse.json({ success: false, error: err.message || "Update failed" }, { status: 400 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const deleted = await Product.findByIdAndDelete(params.id);
        if (!deleted) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: deleted });
    } catch (err: any) {
        console.error("DELETE /api/products/[[id]] ERROR:", err);
        return NextResponse.json({ success: false, error: err.message || "Delete failed" }, { status: 400 });
    }
}