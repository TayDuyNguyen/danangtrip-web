import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const i18nMiddleware = createMiddleware(routing);

// Routes needing authentication
const protectedRoutes = ["/profile", "/bookings", "/settings"];

// Routes for unauthenticated users only
const authRoutes = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Run i18n middleware first
  const response = i18nMiddleware(request);

  // 2. Custom Auth Middleware Logic
  const token = request.cookies.get("token")?.value;
  
  // Helper to check if a path matches our routes (ignoring locale prefix)
  const isMatch = (routes: string[]) => {
    // Remove potential locale prefix /en or /vi
    const cleanPath = pathname.replace(/^\/(en|vi)/, "") || "/";
    return routes.some(route => cleanPath === route || cleanPath.startsWith(`${route}/`));
  };

  const isProtectedRoute = isMatch(protectedRoutes);
  const isAuthRoute = isMatch(authRoutes);

  // Not logged in -> redirect to login (if entering protected route)
  if (!token && isProtectedRoute) {
    const locale = pathname.startsWith("/en") ? "en" : "vi";
    const loginPath = locale === "en" ? "/en/login" : "/login";
    const url = new URL(loginPath, request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in -> redirect to home (if entering auth route)
  if (token && isAuthRoute) {
    const locale = pathname.startsWith("/en") ? "en" : "vi";
    const homePath = locale === "en" ? "/en" : "/";
    return NextResponse.redirect(new URL(homePath, request.url));
  }

  return response;
}

export default proxy;

// next-intl + localePrefix "as-needed": unprefixed routes (/search, /login, …) must hit
// this proxy or [locale] wrongly becomes the first path segment → notFound().
export const config = {
  matcher: [
    "/",
    "/(en|vi)/:path*",
    "/((?!api|trpc|_next|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
