'use server'

import { db } from "@/lib/db"
import { supabase } from "@/lib/supabase";
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

    const existingTestimonial = await db.testimonial.findUnique({ where: { id: testimonialId } });

    if (!existingTestimonial) {
      return { status: 404, message: "Testimonial not found" };
    }

    const bucket = process.env.SUPABASE_BUCKET_NAME!;

    // Extract file path helper
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

    const oldImagePath = extractPath(existingTestimonial.image);
    const newImagePath = extractPath(data.image);

    if (oldImagePath && oldImagePath !== newImagePath) {
      const { error } = await supabase.storage.from(bucket).remove([oldImagePath]);
      if (error) console.warn(`Failed to delete old testimonial image: ${error.message}`);
    }

    const updatedTestimonial = await db.testimonial.update({
      where: { id: testimonialId },
      data,
    });

    if (!updatedTestimonial) {
      return { status: 400, message: "Failed to update testimonial" };
    }

    return { status: 200, message: "Testimonial updated successfully", data: updatedTestimonial };
  } catch (error) {
    console.error("Update testimonial error:", error);
    return { status: 500, message: "Something went wrong on the server" };
  }
};

// Delete testimonial
export const deleteTestimonial = async (testimonialId: string) => {
  try {
    if (!testimonialId) return { status: 400, message: "Testimonial ID is required" };

    const testimonial = await db.testimonial.findUnique({ where: { id: testimonialId } });

    if (!testimonial) return { status: 404, message: "Testimonial not found" };

    const bucket = process.env.SUPABASE_BUCKET_NAME!;
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