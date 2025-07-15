import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("firebase-auth-token")?.value;

  const protectedRoutes = ["/app"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const verifyUrl = new URL("/api/auth/verify", request.url);
      const verifyResponse = await fetch(verifyUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!verifyResponse.ok) {
        throw new Error("Looks like your session expired");
      }

      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.set("firebase-auth-token", "", {
        expires: new Date(0),
        path: "/",
        secure: true,
        sameSite: "strict",
      });
      return response;
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/app/:path*"],
};
