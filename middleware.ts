import { NextRequest, NextResponse } from "next/server";

// Use request.cookies instead of js-cookie (which is for client-side)
export const middleware = (request: NextRequest) => {
  const userToken = request.cookies.get("usertoken")?.value;
  const vendorToken = request.cookies.get("vendortoken")?.value;
  const adminToken = request.cookies.get("admintoken")?.value;

  const { pathname } = request.nextUrl;

  // Example: Protect "/" for ALL authenticated users
  if (pathname === "/") {
    if (!userToken && !vendorToken && !adminToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Example: Protect "/vendor" routes for vendors only
  if (pathname.startsWith("/vendor")) {
    if (!vendorToken) {
      return NextResponse.redirect(new URL("/vendor/login", request.url));
    }
  }

  // Example: Protect "/admin" routes for admins only
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/adminlogin", request.url));
    }
  }

  // Example: Protect "/user" routes for users only
  if (pathname.startsWith("/user")) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/user/login", request.url));
    }
  }

  // Allow all other paths
  return NextResponse.next();
};
