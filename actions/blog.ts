'use server';

import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { BlogInput, ResponseBlogInput } from "@/types/type"

export type PaginatedBlogResponse = {
  data: ResponseBlogInput[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export const createBlog = async(data: BlogInput) =>{
   
    try {
         if(!data)return {status:400,message:"data is not found" }
          const res = await db.blog.create({
            data:{
                ...data
            }
          })
          if(!res)return{
            status:404,
            message:"Failed to create blog"
          }
          return {status:200, message:"Blog to create successfully"}
    } catch (error) {
          return {status:500,message:"Someting wrong in server"}
    }

}


export const getBlogs = async (page: number = 1):Promise<PaginatedBlogResponse> => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/blogs?page=${page}`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to load blogs");
  return await res.json();
};

export const updateBlog = async (data: BlogInput, blogId: string) => {
  try {
    if (!blogId) return { status: 400, message: "Blog ID is required" };

    const existingBlog = await db.blog.findUnique({ where: { id: blogId } });

    if (!existingBlog) return { status: 404, message: "Blog not found" };

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

    const oldImagePath = extractPath(existingBlog.image);
    const newImagePath = extractPath(data.image);

    if (oldImagePath && oldImagePath !== newImagePath) {
      const { error } = await supabase.storage.from(bucket).remove([oldImagePath]);
      if (error) console.warn(`Failed to delete old blog image: ${error.message}`);
    }

    await db.blog.update({
      where: { id: blogId },
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
      },
    });

    return { status: 200, message: "Blog updated successfully" };
  } catch (error) {
    console.error("Update blog error:", error);
    return { status: 500, message: "Something went wrong updating the blog" };
  }
};

// Delete blog
export const deleteBlog = async (blogId: string) => {
  try {
    if (!blogId) return { status: 400, message: "Blog ID is required" };

    const blog = await db.blog.findUnique({ where: { id: blogId } });

    if (!blog) return { status: 404, message: "Blog not found" };

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

    const imagePath = extractPath(blog.image);

    if (imagePath) {
      const { error } = await supabase.storage.from(bucket).remove([imagePath]);
      if (error) console.warn(`Failed to delete blog image: ${error.message}`);
    }

    await db.blog.delete({ where: { id: blogId } });

    return { status: 200, message: "Blog deleted successfully" };
  } catch (error) {
    console.error("Delete blog error:", error);
    return { status: 500, message: "Failed to delete blog" };
  }
};