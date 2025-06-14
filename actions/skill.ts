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

    const extractPath = (url?: string) => {
      if (!url) return null;
      const parts = url.split(`${bucket}/`);
      return parts.length > 1 ? parts[1] : null;
    };

    // Step 1: Map old skills by unique key (e.g., name+desc)
    const oldImageMap = new Map<string, string>();
    for (const sector of oldData) {
      for (const skill of sector.skills) {
        const key = `${skill.name}||${skill.desc}`;
        oldImageMap.set(key, skill.image);
      }
    }

    // Step 2: Find which old images are no longer in newData
    const stillUsed = new Set<string>();
    for (const sector of newData) {
      for (const skill of sector.skills) {
        const key = `${skill.name}||${skill.desc}`;
        const oldImage = oldImageMap.get(key);

        // Same skill with same image — keep it
        if (oldImage && oldImage === skill.image) {
          stillUsed.add(oldImage);
        }
      }
    }

    const allOldImages = [...oldImageMap.values()];
    const imagesToDelete = allOldImages.filter((url) => !stillUsed.has(url));

    // Step 3: Delete only unused images from Supabase
    const pathsToDelete = imagesToDelete
      .map((url) => extractPath(url))
      .filter(Boolean) as string[];

    if (pathsToDelete.length) {
      const { error } = await supabase.storage.from(bucket).remove(pathsToDelete);
      if (error) {
        console.warn("Some images failed to delete:", error.message);
      }
    }

    // Step 4: Delete old skillTypes from DB (by name)
    const oldSkillTypeNames = oldData.map((s) => s.title);
    await db.skillType.deleteMany({
      where: { name: { in: oldSkillTypeNames } },
    });

    // Step 5: Re-create all new skillTypes and skills
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

    // Helper to extract path from Supabase public URL
    const extractPath = (url?: string) => {
      if (!url) return null;
      const parts = url.split(`${bucket}/`);
      return parts.length > 1 ? parts[1] : null;
    };

    for (const id of ids) {
      const skills = await db.skill.findMany({ where: { skillTypeId: id } });

      for (const skill of skills) {
        const skillImagePath = extractPath(skill.skillImage);
        if (skillImagePath) {
          const { error } = await supabase.storage.from(bucket).remove([skillImagePath]);
          if (error) {
            console.warn(`Failed to delete skill image ${skillImagePath}:`, error.message);
          }
        }
      }

      await db.skillType.delete({ where: { id } });
    }

    return { status: 200, message: "All selected skill types deleted" };
  } catch (error) {
    console.error("Bulk delete error:", error);
    return { status: 500, message: "Failed to delete skill types" };
  }
};