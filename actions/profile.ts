'use server';

import { db } from "@/lib/db";
import { supabase as Supabase } from "@/lib/supabase-server";
import { ProfileInput, ResponseProfileType } from "@/types/type"

type ProfileListResponse = ProfileInput[];

export const createProfile = async(data:ProfileInput) =>
{
    try {

        if(!data)return {status:400,message:"data is not found" }
       
    const res = await db.profile.create({
       data:{
        ...data,
        socialMedia:{
            create:data.socialMedia
        }
       }
    })

    if(!res) return{
        status:400,message:"Failed to create profile"
    }
    return {status:200,message:"Profile create successfully"}

    } catch (error) {
        return {status:500,message:"Someting wrong in server"}
    }

}


export const fetchProfile = async (): Promise<ResponseProfileType> => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/profile`, { method: "GET",  });

  if (!res.ok) throw new Error("Failed to fetch profile");

  const data = await res.json(); 

  return data;
};


export const updateProfile = async (profileId: string, data: ProfileInput) => {
  try {
    if (!profileId) {
      return { status: 400, message: "Profile ID is required" };
    }

    const profile = await db.profile.findUnique({ where: { id: profileId } });
    if (!profile) {
      return { status: 404, message: "Profile not found" };
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const fullPrefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;

    const existingImages = {
      primaryImage: profile.primaryImage,
      secondaryImage: profile.secondaryImage,
      metaImage: profile.metaImage,
      openGraphImage: profile.openGraphImage,
      twitterImage: profile.twitterImage,
    };

    const incomingImages = {
      primaryImage: data.primaryImage,
      secondaryImage: data.secondaryImage,
      metaImage: data.metaImage,
      openGraphImage: data.openGraphImage,
      twitterImage: data.twitterImage,
    };

    const pathsToDelete: string[] = [];

    for (const key of Object.keys(existingImages) as Array<keyof typeof existingImages>) {
      const oldUrl = existingImages[key];
      const newUrl = incomingImages[key];

      if (oldUrl && oldUrl !== newUrl && oldUrl.startsWith(fullPrefix)) {
        const relativePath = decodeURIComponent(oldUrl.replace(fullPrefix, ""));
        if (relativePath) {
          pathsToDelete.push(relativePath);
        }
      }
    }

    if (pathsToDelete.length > 0) {
      const { error } = await Supabase.storage.from(bucket).remove(pathsToDelete);
      if (error) {
        console.warn("Failed to delete one or more profile images:", error.message);
      } else {
        console.log("Deleted old profile images:", pathsToDelete);
      }
    }

    const updated = await db.profile.update({
      where: { id: profileId },
      data: {
        ...data,
        socialMedia: {
          deleteMany: {},
          create: data.socialMedia.map((item) => ({
            platformName: item.platformName,
            platformLink: item.platformLink,
          })),
        },
      },
    });

    return {
      status: 200,
      message: "Profile updated successfully",
      data: updated,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { status: 500, message: "Failed to update profile" };
  }
};




export const removeProfile = async (profileId: string) => {
  try {
    if (!profileId) {
      return { status: 400, message: "Profile ID is required" };
    }

    const profile = await db.profile.findUnique({ where: { id: profileId } });
    if (!profile) {
      return { status: 404, message: "Profile not found" };
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!; // e.g. 'images'
    const imageUrls = [
      profile.primaryImage,
      profile.secondaryImage,
      profile.metaImage,
      profile.openGraphImage,
      profile.twitterImage,
    ];

    const pathsToDelete: string[] = [];

    for (const url of imageUrls) {
      if (!url) continue;

      try {
        const urlObj = new URL(url);
        const expectedPrefix = `/storage/v1/object/public/${bucket}/`;

        if (urlObj.pathname.startsWith(expectedPrefix)) {
          const relativePath = decodeURIComponent(
            urlObj.pathname.slice(expectedPrefix.length)
          );
          if (relativePath) {
            pathsToDelete.push(relativePath);
          }
        } else {
          console.warn("URL does not match bucket prefix:", url);
        }
      } catch (err) {
        console.warn("Invalid image URL:", url);
      }
    }

    if (pathsToDelete.length > 0) {
      const { error } = await Supabase.storage.from(bucket).remove(pathsToDelete);
      if (error) {
        console.error("Failed to delete images:", error.message);
      } else {
        console.log("Deleted images:", pathsToDelete);
      }
    }

    await db.profile.delete({ where: { id: profileId } });

    return { status: 200, message: "Profile and images deleted successfully" };
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { status: 500, message: "Server error" };
  }
};