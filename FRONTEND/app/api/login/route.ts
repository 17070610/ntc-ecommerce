import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('🔍 Frontend API: Full request body:', JSON.stringify(body));
        console.log('🔍 Email:', body.email);
        console.log('🔍 Password length:', body.password?.length);

        // Call your backend API
        const backendUrl = 'http://localhost:5000/api/auth/login';
        console.log('🔍 Calling backend:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('🔍 Backend response status:', response.status);

        const responseText = await response.text();
        console.log('🔍 Backend raw response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('❌ Failed to parse response:', responseText);
            return NextResponse.json(
                { message: 'Invalid response from server' },
                { status: 500 }
            );
        }

        if (!response.ok) {
            console.error('❌ Backend error:', data);
            return NextResponse.json(
                { message: data.message || 'Invalid credentials' },
                { status: response.status }
            );
        }

        // Rest of your code...
        const token = data.data?.token || data.token;
        const userData = data.data || data.user;

        if (!token) {
            console.error('❌ No token in response:', data);
            return NextResponse.json(
                { message: 'Authentication failed - no token received' },
                { status: 500 }
            );
        }

        const nameParts = (userData.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const res = NextResponse.json({
            token: token,
            user: {
                id: userData._id || userData.id,
                firstName: firstName,
                lastName: lastName,
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

        console.log('✅ Login successful, cookie set');

        return res;
    } catch (error: any) {
        console.error('❌ Login API error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}