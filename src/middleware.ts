// middleware.ts - enforced name
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname
    
        // Manage route protection
        const isAuth = await getToken({ req })
        const isLoginPage = pathname.startsWith('/login')

        // What are the sensitive routes that need protecting?
        const sensitiveRoute = ['/dashboard']
        const isAccessingSensitiveRoute = sensitiveRoute.some((route) => pathname.startsWith(route))
    
        //If user is logged in, do not display the login route but redirect to dashboard
        if (isLoginPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }

            // Pass along the request
            return NextResponse.next()
        }

        if (!isAuth && isAccessingSensitiveRoute) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        if (pathname === "/") {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }, {
        callbacks: {
            async authorized() {
                return true
            }
        }
    }
)

// When to invoke the middleware?
export const config = {
    matchter: ['/', '/login', '/dashboard/:path*']
}