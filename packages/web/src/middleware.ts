import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Protect all /erp/* routes
	if (pathname.startsWith("/erp")) {
		// Check for session cookie (Better Auth uses 'kensaku.session_token' based on cookiePrefix)
		const sessionCookie = request.cookies.get("kensaku.session_token");

		if (!sessionCookie) {
			// Redirect to sign-in with return URL
			const signInUrl = new URL("/auth/sign-in", request.url);
			signInUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(signInUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$).*)",
	],
};
