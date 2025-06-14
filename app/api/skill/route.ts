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
    const skillType = await db.skillType.findMany({
    include: {
      skills: true,
    },
  });
   return NextResponse.json(skillType);
    } catch (error) {
           console.error("Error fetching skills:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching skills" },
      { status: 500 }
    );
    }


}