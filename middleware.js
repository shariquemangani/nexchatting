import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.get("isLoggedIn")?.value;

  // Protected paths
  const protectedPaths = ["/chats", "/contacts", "/settings"];

  // Check if the user is trying to access a protected path
  if (
    !isLoggedIn && // User is not logged in
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next(); // Allow access
}

export const config = {
  matcher: ["/chats", "/contacts", "/settings"], // Match exact paths and subpaths
};
