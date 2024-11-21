import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  // Retrieve cookies from the request
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.get("isLoggedIn");
  // List of protected paths
  const protectedPaths = ["/profile", "/dashboard"];
  // Check if the user is trying to access a protected page and is not logged in
  if (
    !isLoggedIn &&
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    // Redirect to login page if not logged in
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to the requested page if user is logged in or accessing unprotected pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/chats", "/contacts", "/settings"], // Apply middleware to these paths
};
