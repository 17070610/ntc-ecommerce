import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('Frontend API: Login attempt for:', body.email);
        console.log('Frontend API: Calling backend at http://localhost:5000/api/auth/login');

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        console.log('Backend response status:', response.status);
        console.log('Backend response:', data);

        if (!response.ok) {
            console.error('Backend error:', data);
            return NextResponse.json(
                { message: data.message || 'Invalid credentials' },
                { status: response.status }
            );
        }

        const token = data.data.token;
        const userData = data.data;

        const nameParts = userData.name.split(' ');

        const res = NextResponse.json({
            token: token,
            user: {
                id: userData._id,
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(' '),
                email: userData.email,
                role: userData.role,
            },
        });

        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        console.log('Login successful, cookie set');
        return res;
    } catch (error: any) {
        console.error('Login API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}