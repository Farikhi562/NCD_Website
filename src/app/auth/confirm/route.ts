import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Email-confirmation landing route (Supabase Auth `emailRedirectTo` for sign-up).
 *
 * GoTrue verifies the emailed link first, then redirects here:
 *  - `?code=<auth code>` (PKCE) — exchange it to establish the session, then continue
 *    into the app. The exchange can fail when the link is opened in a different
 *    browser than the one that registered (the code verifier only exists there);
 *    the account is already confirmed at that point, so we send the user to sign in.
 *  - `?error_code=…` — GoTrue could not verify the link (expired/invalid); the login
 *    page explains what to do next.
 *  - nothing — a stray visit; fall back to the login page.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/app/onboarding";

  const code = searchParams.get("code");
  const errorCode = searchParams.get("error_code");

  if (errorCode) {
    return NextResponse.redirect(`${origin}/login?verify_error=expired`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    // The email is verified (GoTrue confirmed before redirecting), but this
    // browser cannot complete the PKCE exchange — send the user to sign in.
    return NextResponse.redirect(`${origin}/login?verified=1`);
  }

  return NextResponse.redirect(`${origin}/login`);
}
