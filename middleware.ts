import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Get the secret key for jose
function getSecretKey() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin-token")?.value;

  const isDashboard = pathname.startsWith("/dashboard");
  const isRoot = pathname === "/";

  if (!token) {
    // No token
    if (isDashboard) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (payload.role === "admin") {
      // ✅ Authenticated as admin
      if (isRoot) {
        // If visiting root while logged in, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // ❌ Not admin
    return NextResponse.redirect(new URL("/", req.url));
  } catch (err) {
    // ❌ Invalid token
    if (isDashboard) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/dashboard"],
};
