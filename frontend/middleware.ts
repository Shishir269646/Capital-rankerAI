import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/register", "/forgot-password", "/", "/about", "/pricing", "/features"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if path is public
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // Get auth token from cookie or header
    const token = request.cookies.get("auth-token")?.value;

    // Redirect to login if accessing protected route without token
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to dashboard if accessing auth pages while logged in
    if (isPublicPath && token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
