'use server';

import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase-server";
import { PortfolioInput, ResponsePortfolioInput } from "@/types/type"

export type PaginatedPortfolioResponse = {
  data: ResponsePortfolioInput[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export const createPortfolio = async(data:PortfolioInput) =>{
    
    try {
       if(!data)return {status:400,message:"data is not found" }

    const res = await db.portfolio.create({
        data:{
            ...data,
            technology:{
                create:data.technology
            }
        }
    })
         if(!res)return{
            status:404,
            message:"Failed to create porfolio"
          }
            return {status:200, message:"Portfolio to create successfully"}
    } catch (error) {
          return {status:500,message:"Someting wrong in server"}
    }

}

export const getPortfolios = async (page: number = 1):Promise<PaginatedPortfolioResponse> => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/portfolio?page=${page}`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to load portfolios");
  return await res.json();
};


// ✅ Update Portfolio

export const updatePortfolio = async (data: any, portfolioId: string) => {
  try {
    if (!portfolioId) {
      return { status: 400, message: "Portfolio ID is required" };
    }

    const existing = await db.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!existing) {
      return { status: 404, message: "Portfolio not found" };
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;

    // ✅ Delete old image if changed
    const oldImage = existing.image;
    const newImage = data.image;

    if (oldImage && oldImage !== newImage && oldImage.startsWith(publicPrefix)) {
      const relativePath = decodeURIComponent(oldImage.replace(publicPrefix, ""));
      if (relativePath) {
        const { error } = await supabase.storage.from(bucket).remove([relativePath]);
        if (error) {
          console.warn("⚠️ Failed to delete old portfolio image:", error.message);
        } else {
          console.log("🗑️ Deleted old image from Supabase:", relativePath);
        }
      }
    }

    // ✅ Update portfolio and technologies
    await db.portfolio.update({
      where: { id: portfolioId },
      data: {
        title: data.title,
        desc: data.desc,
        image: newImage,
        react: data.react,
        externalLink: data.externalLink,
        technology: {
          deleteMany: {}, // clear old
          create: data.technology,
        },
      },
    });

    return { status: 200, message: "Portfolio updated successfully" };
  } catch (error) {
    console.error("❌ Update portfolio error:", error);
    return { status: 500, message: "Something went wrong on the server" };
  }
};


// ✅ Delete Portfolio (only main image removed from Supabase)
export const deletePortfolio = async (portfolioId: string) => {
  try {
    if (!portfolioId) {
      return { status: 400, message: "Portfolio ID is required" };
    }

    const portfolio = await db.portfolio.findUnique({
      where: { id: portfolioId },
      include: { technology: true },
    });

    if (!portfolio) {
      return { status: 404, message: "Portfolio not found" };
    }

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

    // ✅ Only delete portfolio main image from Supabase
    const portfolioImagePath = extractPath(portfolio.image);
    if (portfolioImagePath) {
      const { error } = await supabase.storage.from(bucket).remove([portfolioImagePath]);
      if (error) {
        console.warn("Failed to delete portfolio image:", error.message);
      }
    }

    // ✅ Delete portfolio from DB
    await db.portfolio.delete({ where: { id: portfolioId } });

    return { status: 200, message: "Portfolio and image deleted successfully" };
  } catch (error) {
    console.error("Delete portfolio error:", error);
    return { status: 500, message: "Failed to delete portfolio" };
  }
};
