import { type NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("session");
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!hasSession && isAuthRoute) {
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/auth/login", request.url);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
