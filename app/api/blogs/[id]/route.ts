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

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const blogId = context.params.id;

  if (!blogId || typeof blogId !== "string") {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const blog = await db.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
