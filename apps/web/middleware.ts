import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // SECURITY: Block CVE-2025-29927 middleware bypass attempt
  // Attackers can add x-middleware-subrequest header to skip middleware entirely
  if (request.headers.has("x-middleware-subrequest")) {
    return new NextResponse(null, { status: 403 });
  }

  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // Pass pathname to server components via header
  supabaseResponse.headers.set("x-next-pathname", pathname);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip middleware if Supabase not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          }),
        );
      },
    },
  });

  // Refresh session (important for Server Components)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.startsWith("/admin-hub");
  const isAdminLogin = pathname === "/admin-hub/login";
  const isPublicAuth = pathname.startsWith("/auth/");

  // ── Admin routes ──────────────────────────────────────
  // Admin login page: if already logged in, skip to /admin-hub (role check happens server-side)
  if (isAdminLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin-hub";
    return NextResponse.redirect(url);
  }

  // Admin protected routes (except login): redirect to admin login if not authenticated
  if (isAdminRoute && !isAdminLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin-hub/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // ── Public routes ─────────────────────────────────────
  // Protect /account route
  if (!user && pathname.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from PUBLIC auth pages (not admin login)
  if (user && isPublicAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
