import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({
      data: testimonials,
    });
  } catch (error) {
    console.error("[GET_TESTIMONIALS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}