import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // First refresh the session
  const response = await updateSession(request);

  // Check if the request is for a protected route
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/about",
    "/people",
    "/projects",
    "/competitions",
    "/knowledge",
    "/activities",
    "/transparency",
    "/archive",
    "/news",
    "/login",
    "/register",
    "/auth/reset-password",
    "/auth/confirm",
    "/terms",
  ];

  // Check if the path is a public route or starts with a public route prefix
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  // API routes, static files, etc. are handled by updateSession
  const isApiOrStatic = pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    /\.(png|jpg|svg|ico)$/.test(pathname);

  // If it's a protected route and not public/api/static, check for authentication
  if (!isPublicRoute && !isApiOrStatic) {
    // The updateSession already refreshed the session
    // We need to check if user is authenticated by looking at the session cookie
    const hasSession = request.cookies.get("sb-access-token") ||
      request.cookies.get("sb-refresh-token");

    if (!hasSession) {
      // Redirect to login with the original path as redirect parameter
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if ((pathname === "/login" || pathname === "/register") && request.cookies.get("sb-access-token")) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/app/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};