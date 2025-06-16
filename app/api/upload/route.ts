import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "buffer";

export const runtime = "nodejs"; // Ensure Node.js runtime is used

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fileEntries = Array.from(formData.entries()).filter(
      ([_, value]) => value instanceof File && (value as File).size > 0
    );

    const bucketName = process.env.SUPABASE_BUCKET_NAME!;
    if (!bucketName) {
      return NextResponse.json(
        { success: false, message: "SUPABASE_BUCKET_NAME not set" },
        { status: 500 }
      );
    }

    const results: Record<string, any> = {};

    for (const [key, value] of fileEntries) {
      const file = value as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        results[key] = { success: false, message: error.message };
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      results[key] = {
        success: true,
        path: filePath,
        publicUrl: publicUrlData?.publicUrl,
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: String(error) },
      { status: 500 }
    );
  }
}
