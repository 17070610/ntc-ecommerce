import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload directory inside /public
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Safe filename
        const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filepath = path.join(uploadDir, safeName);

        await writeFile(filepath, buffer);

        // Return URL relative to /public
        return NextResponse.json({
            success: true,
            url: `/uploads/${safeName}`,
        });
    } catch (err: any) {
        console.error("UPLOAD ERROR:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Upload failed" },
            { status: 500 }
        );
    }
}
