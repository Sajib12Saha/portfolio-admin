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


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam) : 1;
  const perPage = 6;

  const skip = (page - 1) * perPage;

  try {
    const [blogs, total] = await Promise.all([
      db.blog.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      db.blog.count(),
    ]);

    return NextResponse.json({
      data: blogs,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
