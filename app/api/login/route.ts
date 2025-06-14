import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { passKey } = await request.json();

    // Replace with your own secure pass key validation logic.
    if (passKey !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "Invalid password key" },
        { status: 404 }
      );
    }

    // Generate JWT token with an expiration of 7 days.
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // Create the response and set the cookie.
    const response = NextResponse.json({
      message: "Login successful",
    });

    // Set the cookie with 7 days expiry.
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
