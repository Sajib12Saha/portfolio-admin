'use server';
import { ResumeFormValues } from "@/components/form/resume-form";
import { db } from "@/lib/db";
import { ResumeInputType } from "@/types/type";




export const createResume = async (data: ResumeFormValues) => {
  try {
    if (!data) {
      return { status: 400, message: "Data not found" };
    }

    const resume = await db.resume.create({
      data: {
        education: {
          create: data.educationSchema.map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            startYear: edu.startYear,
            endYear: edu.endYear,
            desc: edu.desc,
            cgpa: edu.cgpa,
          })),
        },
        experience: {
          create: data.experienceSchema.map((exp) => ({
            profession: exp.profession,
            company: exp.company,
            desc: exp.desc,
            technology: exp.technology.map((t) => t.value),
          })),
        },
      },
    });

    return { status: 200, message: "Resume created successfully" };
  } catch (error) {
    console.error("Error creating resume:", error);
    return { status: 500, message: "Server error" };
  }
};


export const getResume = async ():Promise<ResumeInputType> => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/resume`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to load resumes");
  return await res.json();
};


export const updateResume = async (data: ResumeFormValues, resumeId: string) => {
  try {
    if (!resumeId || !data) {
      return { status: 400, message: "Invalid data or resume ID" };
    }

    // Delete existing nested records first
    await db.education.deleteMany({
      where: { resumeId },
    });

    await db.experience.deleteMany({
      where: { resumeId },
    });

    // Then update the main resume with new nested data
    await db.resume.update({
      where: { id: resumeId },
      data: {
        education: {
          create: data.educationSchema.map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            startYear: edu.startYear,
            endYear: edu.endYear,
            desc: edu.desc,
            cgpa: edu.cgpa,
          })),
        },
        experience: {
          create: data.experienceSchema.map((exp) => ({
            profession: exp.profession,
            company: exp.company,
            desc: exp.desc,
            technology: exp.technology.map((tech)=> tech.value),
          })),
        },
      },
    });

    return { status: 200, message: "Resume updated successfully" };
  } catch (error) {
    console.error("Error updating resume:", error);
    return { status: 500, message: "Server error while updating resume" };
  }
};


export const removeResume = async (resumeId: string) => {
  try {
    if (!resumeId) {
      return { status: 404, message: "Resume Id is required" };
    }

    const deleteResume = await db.resume.delete({
      where: { id: resumeId }, 
    });

    if(!deleteResume) return{
            status: 400,
      message: "Resume deleted failed",
    }

    return {
      status: 200,
      message: "Resume deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting resume:", error);
    return {
      status: 500,
      message: "Failed to delete resume",
      error,
    };
  }
};

