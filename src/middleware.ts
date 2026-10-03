import { type NextRequest } from "next/server";
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
    "/login",
    "/register",
    "/auth/reset-password",
    "/auth/confirm",
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

  return response;
}

import { NextResponse } from "next/server";