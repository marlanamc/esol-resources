import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token as any;

        // Force password change flow
        const isResetPage = req.nextUrl.pathname.startsWith("/password-reset");
        if (token?.mustChangePassword && !isResetPage) {
            const url = req.nextUrl.clone();
            url.pathname = "/password-reset";
            return NextResponse.redirect(url);
        }
        if (!token?.mustChangePassword && isResetPage) {
            const url = req.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    },
    {
        pages: {
            signIn: "/login",
        },
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = { matcher: ["/dashboard/:path*", "/password-reset"] };
