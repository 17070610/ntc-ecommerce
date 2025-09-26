import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Split name into firstName and lastName
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return NextResponse.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to login" },
            { status: 500 }
        );
    }
}