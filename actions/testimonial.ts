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
      return {
        status: 404,
        message: "Testimonial ID and data are required",
      };
    }

    const existingTestimonial = await db.testimonial.findUnique({
      where: { id: testimonialId },
    });

    if (!existingTestimonial) {
      return {
        status: 404,
        message: "Testimonial not found",
      };
    }

    const bucket = process.env.SUPABASE_BUCKET_NAME!;
    
    // Adjust these keys based on what image fields your testimonial has:
    const existingImages = {
      image: existingTestimonial.image,
      // Add other image fields if you have more
    };

    const incomingImages = {
      image: data.image,
      // Add other image fields if needed
    };

    const pathsToDelete: string[] = [];

    for (const key of Object.keys(existingImages) as Array<keyof typeof existingImages>) {
      const oldUrl = existingImages[key];
      const newUrl = incomingImages[key];

      if (oldUrl && oldUrl !== newUrl) {
        // Extract file path after bucket name
        const match = oldUrl.split(`${bucket}/`)[1];
        if (match) {
          pathsToDelete.push(match);
        }
      }
    }

    if (pathsToDelete.length > 0) {
      const { error } = await supabase.storage.from(bucket).remove(pathsToDelete);
      if (error) {
        console.warn("Failed to delete old testimonial image(s):", error.message);
      }
    }

    // Now update testimonial in DB
    const updatedTestimonial = await db.testimonial.update({
      where: { id: testimonialId },
      data: {
        ...data,
      },
    });

    if (!updatedTestimonial) {
      return {
        status: 400,
        message: "Failed to update testimonial",
      };
    }

    return {
      status: 200,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return {
      status: 500,
      message: "Something went wrong on the server",
    };
  }
};

export const deleteTestimonial = async (testimonialId: string) => {
  try {
    if (!testimonialId) {
      return {
        status: 400,
        message: "Testimonial ID is required",
      };
    }

    // 1. Get testimonial from database
    const testimonial = await db.testimonial.findUnique({
      where: { id: testimonialId },
    });

    if (!testimonial) {
      return {
        status: 404,
        message: "Testimonial not found",
      };
    }

    // 2. Extract file path from Supabase public URL
    const imageUrl = testimonial.image;
    const bucket = process.env.SUPABASE_BUCKET_NAME!;
    const path = imageUrl?.split(`${bucket}/`)[1];
    if (path) {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) {
        console.warn(`Failed to delete image from Supabase: ${path}`, error.message);
      }
    }

    // 4. Delete testimonial from DB
    await db.testimonial.delete({
      where: { id: testimonialId },
    });

    return {
      status: 200,
      message: "Testimonial deleted successfully",
    };
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    return {
      status: 500,
      message: "Something went wrong while deleting testimonial",
    };
  }
};
