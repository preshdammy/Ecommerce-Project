import { NextRequest, NextResponse } from "next/server";
import cookie from "js-cookie";

export const middleware = (request: NextRequest) => {
    const token = cookie.get("token")

    if (request.nextUrl.pathname === "/") {
        if (!token) {
            return NextResponse.redirect( new URL("/login", request.url))
        }
    }
    
}