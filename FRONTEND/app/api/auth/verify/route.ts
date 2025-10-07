import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value

        if (!token) {
            return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET)

        return NextResponse.json({
            success: true,
            data: decoded,
        })
    } catch (error: any) {
        console.error("Token verification error:", error.message)
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }
}