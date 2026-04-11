import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes cần đăng nhập
const protectedRoutes = ["/profile", "/bookings", "/settings"];

// Routes chỉ cho chưa đăng nhập
const authRoutes = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Kiểm tra route cần bảo vệ
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Kiểm tra route auth
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Chưa login mà vào trang protected -> redirect login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Đã login mà vào login/register -> redirect home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/bookings/:path*", "/login", "/register"],
};
