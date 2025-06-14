import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the path based on your setup

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
const profile = await db.profile.findFirst({
  include: {
    socialMedia: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching profiles" },
      { status: 500 }
    );
  }
};
