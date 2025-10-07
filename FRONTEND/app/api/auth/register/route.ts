import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('Frontend API: Register attempt for:', body.email);

        // Call backend register endpoint
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${body.firstName} ${body.lastName}`,
                email: body.email,
                password: body.password,
            }),
        });

        const data = await response.json();
        console.log('Backend register response:', data);

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful',
        });
    } catch (error: any) {
        console.error('Register API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}