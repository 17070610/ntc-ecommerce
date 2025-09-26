import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { firstName, lastName, email, password } = await req.json();

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already in use" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Use 'name' field that exists in your current model
        const newUser = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                firstName: firstName,
                lastName: lastName,
                email: newUser.email,
                role: newUser.role || 'user',
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to register" },
            { status: 500 }
        );
    }
}