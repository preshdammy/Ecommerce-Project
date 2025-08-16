import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get("usertoken")?.value;
  const vendorToken = request.cookies.get("vendortoken")?.value;
  const adminToken = request.cookies.get("admintoken")?.value;

  const { pathname } = request.nextUrl;


  if (pathname.startsWith("/user") && !pathname.startsWith("/user/(auth)") && pathname !== "/user/login" && pathname !== "/user/signup") {
    if (!userToken) {
      return NextResponse.redirect(new URL("/user/login", request.url));
    }
  }
  if (pathname.startsWith("/vendor") && !pathname.startsWith("/vendor/(auth)") && pathname !== "/vendor/login" && pathname !== "/vendor/signup") {
    if (!vendorToken) {
      return NextResponse.redirect(new URL("/vendor/login", request.url));
    }
  }
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/(auth)") && pathname !== "/admin/login" ) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}


