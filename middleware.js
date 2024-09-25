// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /protected, /api/user)
  const path = request.nextUrl.pathname;

  // Define which paths are accessible to the public
  const publicPaths = ["/", "/auth"];

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path);

  // Get the user object from the cookies
  const userCookie = request.cookies.get("user")?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;

  // If the path is not public and there's no user, redirect to login
  if (!isPublicPath && !user) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
