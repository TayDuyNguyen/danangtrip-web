import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

/**
 * Cloudflare/OpenNext requires Edge Middleware.
 * Next.js 16 warns that middleware is deprecated in favor of proxy, but proxy
 * currently runs on Node.js runtime and is not supported by Workers.
 */
export const runtime = "experimental-edge";

const i18nMiddleware = createMiddleware(routing);

const protectedRoutes = ["/profile", "/settings", "/dashboard", "/payment", "/profile/bookings", "/profile/favorites", "/profile/notifications", "/profile/recommendations"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Set x-pathname header so getRequestConfig can access the current URL path
  request.headers.set("x-pathname", pathname);

  const response = i18nMiddleware(request);

  const token = request.cookies.get("token")?.value;

  const isMatch = (routes: string[]) => {
    const cleanPath = pathname.replace(/^\/(en|vi)/, "") || "/";
    return routes.some((route) => cleanPath === route || cleanPath.startsWith(`${route}/`));
  };

  const cleanPath = pathname.replace(/^\/(en|vi)/, "") || "/";

  if (cleanPath === "/nearby" || cleanPath.startsWith("/nearby/")) {
    const localePrefix = pathname.startsWith("/en") ? "/en" : "";
    const redirectUrl = new URL(`${localePrefix}/map?mode=nearby`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const isBookingRoute = /^\/tours\/[^/]+\/book\/?$/.test(cleanPath);

  const isProtectedRoute = isMatch(protectedRoutes) || isBookingRoute;
  const isAuthRoute = isMatch(authRoutes);

  if (!token && isProtectedRoute) {
    const locale = pathname.startsWith("/en") ? "en" : "vi";
    const loginPath = locale === "en" ? "/en/login" : "/login";
    const url = new URL(loginPath, request.url);
    const fullPath = pathname + request.nextUrl.search;
    url.searchParams.set("callbackUrl", fullPath);
    return NextResponse.redirect(url);
  }

  if (token && isAuthRoute) {
    const locale = pathname.startsWith("/en") ? "en" : "vi";
    const homePath = locale === "en" ? "/en" : "/";
    return NextResponse.redirect(new URL(homePath, request.url));
  }

  return response;
}

export default middleware;

// next-intl + localePrefix "as-needed": unprefixed routes must hit middleware
export const config = {
  matcher: [
    "/",
    "/(en|vi)/:path*",
    "/((?!api|trpc|_next|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
