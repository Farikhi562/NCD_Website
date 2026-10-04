import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();

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
    if (!user) {
      // Redirect to login with the original path as redirect parameter
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is authenticated and tries to access login/register, redirect appropriately
  if ((pathname === "/login" || pathname === "/register") && user) {
    // Check onboarding status
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    // Only allow same-site paths (blocks ?redirect=https://evil.example and //evil.example)
    const requested = request.nextUrl.searchParams.get("redirect");
    const redirectTo =
      requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : "/app/dashboard";

    if (profile && !profile.onboarding_completed) {
      return NextResponse.redirect(new URL("/app/onboarding", request.url));
    }
    
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // If accessing onboarding but already completed, redirect to dashboard
  if (pathname === "/app/onboarding" && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (profile && profile.onboarding_completed) {
      return NextResponse.redirect(new URL("/app/dashboard", request.url));
    }
  }

  return supabaseResponse;
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