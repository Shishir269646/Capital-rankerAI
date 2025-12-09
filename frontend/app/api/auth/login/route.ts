import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (email === 'user@example.com' && password === 'password123') {
        return NextResponse.json({ message: 'Login successful', token: 'fake-jwt-token', user: { email: 'user@example.com', name: 'Test User' } });
    } else {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
}
