import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

/**
 * Edge Middleware (not Proxy) — required for @opennextjs/cloudflare:
 * Node.js Proxy is not supported on Workers; see OpenNext build error
 * "Node.js middleware is not currently supported".
 */
export const runtime = "experimental-edge";

const i18nMiddleware = createMiddleware(routing);

const protectedRoutes = ["/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = i18nMiddleware(request);

  const token = request.cookies.get("token")?.value;

  const isMatch = (routes: string[]) => {
    const cleanPath = pathname.replace(/^\/(en|vi)/, "") || "/";
    return routes.some((route) => cleanPath === route || cleanPath.startsWith(`${route}/`));
  };

  const isProtectedRoute = isMatch(protectedRoutes);
  const isAuthRoute = isMatch(authRoutes);

  if (!token && isProtectedRoute) {
    const locale = pathname.startsWith("/en") ? "en" : "vi";
    const loginPath = locale === "en" ? "/en/login" : "/login";
    const url = new URL(loginPath, request.url);
    url.searchParams.set("callbackUrl", pathname);
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
