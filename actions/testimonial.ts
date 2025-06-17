'use server'

import { db } from "@/lib/db"
import { supabase } from "@/lib/supabase-server";
import {TestimonialInput, TestimonialResponseType } from "@/types/type"


export type PaginatedTestimonialsResponse = {
  data: TestimonialResponseType[];
}



export const createTestimonial = async(data:TestimonialInput) =>{
  
    try {
    if(!data)return {status:400,message:"data is not found" }

       const res = await db.testimonial.create({
                data:{
                    ...data
                }
              })
                 if(!res)return{
            status:404,
            message:"Failed to create testimonial"
          }
       return {status:200, message:"Testimonial to create successfully"}
    } catch (error) {
            return {status:500,message:"Someting wrong in server"}
    }

}


export const getTestimonials = async ():Promise<PaginatedTestimonialsResponse> => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/testimonials`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to load testimonials");
  return await res.json();
};




export const updateTestimonial = async (data: TestimonialInput, testimonialId: string) => {
  try {
    if (!testimonialId || !data) {
      return { status: 400, message: "Testimonial ID and data are required" };
    }

    const existing = await db.testimonial.findUnique({
      where: { id: testimonialId },
    });

    if (!existing) {
      return { status: 404, message: "Testimonial not found" };
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;

    const oldImage = existing.image;
    const newImage = data.image;

    // ✅ Delete old image if changed
    if (oldImage && oldImage !== newImage && oldImage.startsWith(publicPrefix)) {
      const relativePath = decodeURIComponent(oldImage.replace(publicPrefix, ""));
      if (relativePath) {
        const { error } = await supabase.storage.from(bucket).remove([relativePath]);
        if (error) {
          console.warn("⚠️ Failed to delete old testimonial image:", error.message);
        } else {
          console.log("🗑️ Deleted old testimonial image from Supabase:", relativePath);
        }
      }
    }

    // ✅ Update testimonial
    const updated = await db.testimonial.update({
      where: { id: testimonialId },
      data: {
        name: data.name,
        rating: data.rating,
        projectTitle: data.projectTitle,
        image: newImage,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    return { status: 200, message: "Testimonial updated successfully", data: updated };
  } catch (error) {
    console.error("❌ Update testimonial error:", error);
    return { status: 500, message: "Something went wrong on the server" };
  }
};

// Delete testimonial
export const deleteTestimonial = async (testimonialId: string) => {
  try {
    if (!testimonialId) return { status: 400, message: "Testimonial ID is required" };

    const testimonial = await db.testimonial.findUnique({ where: { id: testimonialId } });

    if (!testimonial) return { status: 404, message: "Testimonial not found" };

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    const extractPath = (url?: string) => {
      if (!url) return null;
      try {
        const urlObj = new URL(url);
        const expectedPrefix = `/storage/v1/object/public/${bucket}/`;
        if (urlObj.pathname.startsWith(expectedPrefix)) {
          return decodeURIComponent(urlObj.pathname.slice(expectedPrefix.length));
        }
      } catch {
        return null;
      }
      return null;
    };

    const imagePath = extractPath(testimonial.image);

    if (imagePath) {
      const { error } = await supabase.storage.from(bucket).remove([imagePath]);
      if (error) console.warn(`Failed to delete testimonial image: ${error.message}`);
    }

    await db.testimonial.delete({ where: { id: testimonialId } });

    return { status: 200, message: "Testimonial deleted successfully" };
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return { status: 500, message: "Something went wrong while deleting testimonial" };
  }
};