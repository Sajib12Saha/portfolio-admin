'use server';
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

import { AllSkillsInput, SkillTypeResponse } from "@/types/type";


export const createSkill = async (data: AllSkillsInput) => {
  try {
    if (!data || data.length === 0) {
      return { status: 400, message: "No data provided." };
    }

    for (const skillGroup of data) {
      const { title, skills } = skillGroup;

      await db.skillType.create({
        data: {
          name: title,
          skills: {
            create: skills.map((skill) => ({
              name: skill.name,
              desc: skill.desc,
              skillImage: skill.image,
            })),
          },
        },
      });
    }

    return { status: 200, message: "Skills created successfully." };
  } catch (error) {
    console.error("createSkill error:", error);
    return { status: 500, message: "Something went wrong on the server." };
  }
};


export const getSkill = async ():Promise<SkillTypeResponse[]> => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/skill`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to load skill");
  return await res.json();
};


export const updateSkill = async (
  newData: AllSkillsInput,
  oldData: AllSkillsInput
) => {
  try {
    const bucket = process.env.SUPABASE_BUCKET_NAME!;
    if (!bucket) throw new Error("Supabase bucket not configured");

    // Helper function to extract relative path from Supabase public URL
    const extractPath = (url?: string) => {
      if (!url) return null;
      try {
        const urlObj = new URL(url);
        const expectedPrefix = `/storage/v1/object/public/${bucket}/`;

        if (urlObj.pathname.startsWith(expectedPrefix)) {
          return decodeURIComponent(urlObj.pathname.slice(expectedPrefix.length));
        } else {
          console.warn("URL does not match expected Supabase path:", url);
          return null;
        }
      } catch (err) {
        console.warn("Invalid image URL:", url);
        return null;
      }
    };

    // Step 1: Map old skills by unique key (name+desc)
    const oldImageMap = new Map<string, string>();
    for (const sector of oldData) {
      for (const skill of sector.skills) {
        const key = `${skill.name}||${skill.desc}`;
        oldImageMap.set(key, skill.image);
      }
    }

    // Step 2: Determine which old images are still used
    const stillUsed = new Set<string>();
    for (const sector of newData) {
      for (const skill of sector.skills) {
        const key = `${skill.name}||${skill.desc}`;
        const oldImage = oldImageMap.get(key);

        if (oldImage && oldImage === skill.image) {
          stillUsed.add(oldImage);
        }
      }
    }

    const allOldImages = [...oldImageMap.values()];
    const imagesToDelete = allOldImages.filter((url) => !stillUsed.has(url));

    // Step 3: Extract and delete old image paths
    const pathsToDelete = imagesToDelete
      .map((url) => extractPath(url))
      .filter(Boolean) as string[];

    if (pathsToDelete.length > 0) {
      const { error } = await supabase.storage.from(bucket).remove(pathsToDelete);
      if (error) {
        console.warn("Failed to delete skill images:", error.message);
      } else {
        console.log("Deleted old skill images:", pathsToDelete);
      }
    }

    // Step 4: Remove all old skill types (and skills via cascade or manually)
    const oldSkillTypeNames = oldData.map((s) => s.title);
    await db.skillType.deleteMany({
      where: { name: { in: oldSkillTypeNames } },
    });

    // Step 5: Recreate new skill types and skills
    for (const sector of newData) {
      await db.skillType.create({
        data: {
          name: sector.title,
          skills: {
            create: sector.skills.map((skill) => ({
              name: skill.name,
              desc: skill.desc,
              skillImage: skill.image,
            })),
          },
        },
      });
    }

    return { status: 200, message: "Skills updated successfully" };
  } catch (error) {
    console.error("updateSkill error:", error);
    return { status: 500, message: "Server error during skill update" };
  }
};






export const removeSkillType = async (ids: string[]) => {
  try {
    if (!ids.length) {
      return { status: 400, message: "No skill type IDs provided" };
    }

    const bucket = process.env.SUPABASE_BUCKET_NAME!;
    if (!bucket) throw new Error("Supabase bucket not configured");

    // Extract relative path from full Supabase public URL
    const extractPath = (url?: string) => {
      if (!url) return null;
      try {
        const urlObj = new URL(url);
        const expectedPrefix = `/storage/v1/object/public/${bucket}/`;
        if (urlObj.pathname.startsWith(expectedPrefix)) {
          return decodeURIComponent(urlObj.pathname.slice(expectedPrefix.length));
        } else {
          console.warn("URL does not match Supabase bucket structure:", url);
          return null;
        }
      } catch (err) {
        console.warn("Invalid image URL:", url);
        return null;
      }
    };

    const pathsToDelete: string[] = [];

    for (const id of ids) {
      const skills = await db.skill.findMany({ where: { skillTypeId: id } });

      for (const skill of skills) {
        const path = extractPath(skill.skillImage);
        if (path) {
          pathsToDelete.push(path);
        }
      }
    }

    // Remove all images from storage
    if (pathsToDelete.length > 0) {
      const { error } = await supabase.storage.from(bucket).remove(pathsToDelete);
      if (error) {
        console.error("Failed to delete skill images:", error.message);
      } else {
        console.log("Deleted skill images:", pathsToDelete);
      }
    }

    // Delete skill types (cascade deletes skills if set in schema, otherwise handled manually)
    await db.skillType.deleteMany({
      where: { id: { in: ids } },
    });

    return { status: 200, message: "Skill types and images deleted successfully" };
  } catch (error) {
    console.error("Error deleting skill types:", error);
    return { status: 500, message: "Server error during skill type deletion" };
  }
};