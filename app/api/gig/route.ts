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


export const GET = async () => {
  try {
    const gig = await db.gig.findFirst({
      include: {
        basic: true,
        standard: true,
        premium: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

   
    return NextResponse.json(gig);
  } catch (error) {
    console.error("Error fetching gig:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching gig" },
      { status: 500 }
    );
  }
};