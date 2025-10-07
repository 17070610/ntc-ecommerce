import { NextResponse } from 'next/server';

export function middleware(request) {
    console.log('🚀 MIDDLEWARE IS RUNNING!');
    console.log('🔍 Path:', request.nextUrl.pathname);

    const path = request.nextUrl.pathname;

    // Protect admin routes
    if (path.startsWith('/admin') || path.startsWith('/superadmin')) {
        console.log('🔒 Protected route detected!');

        const token = request.cookies.get('token')?.value;
        console.log('🔑 Token exists?', !!token);

        if (!token) {
            console.log('❌ No token found - Redirecting to /auth');
            return NextResponse.redirect(new URL('/auth', request.url));
        }

        console.log('✅ Token found - Access granted');
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/superadmin/:path*'],
};