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
  const perPage = 12;

  const skip = (page - 1) * perPage;

  try {
    const [portfolios, total] = await Promise.all([
      db.portfolio.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: {
          technology: true,
        },
      }),
      db.portfolio.count(),
    ]);

    return NextResponse.json({
      data: portfolios,
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}
