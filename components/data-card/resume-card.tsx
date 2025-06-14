"use client";

import { ResumeInputType } from "@/types/type";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  resume: ResumeInputType;
}

const formatYear = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // return as is if invalid date
  return date.getFullYear();
};

export const ResumeCard = ({ resume }: Props) => {
  return (
    <Tabs defaultValue="education" className="w-full">
      <TabsList className="w-full flex gap-y-2 flex-wrap items-center justify-around rounded-md shadow-md mb-4">
        <TabsTrigger value="education" className="font-semibold">
          Education
        </TabsTrigger>
        <TabsTrigger value="experience" className="font-semibold">
          Experience
        </TabsTrigger>
      </TabsList>

      {/* Education */}
      <TabsContent value="education" className="py-8 lg:px-14">
        <div className="space-y-6">
          {(resume.education ?? []).map((edu, index) => (
            <Card key={index} className="p-4 max-w-lg mx-auto">
              <CardContent className="space-y-2">
                <h3 className="text-xl font-bold dark:text-gray-300">{edu.degree}</h3>
                <p className="text-base text-muted-foreground font-semibold">
                  {edu.institution} ({formatYear(edu.startYear)} - {formatYear(edu.endYear)})
                </p>
                <p className="text-sm text-primary font-medium">CGPA: {edu.cgpa === 0 ? "Ongoing" : edu.cgpa}</p>
                <p className="text-sm text-muted-foreground">{edu.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Experience */}
      <TabsContent value="experience" className="py-8 lg:px-14">
        <div className="space-y-6">
          {(resume.experience ?? []).map((exp, index) => (
            <Card key={index} className="p-4 max-w-lg mx-auto">
              <CardContent className="space-y-2">
                <h3 className="text-xl font-bold dark:text-gray-300">
                  {exp.profession} at {exp.company}
                </h3>
                <p className="text-sm text-primary">
                  Technologies:{" "}
                  <span className="font-medium ml-1 text-muted-foreground">
                    {exp.technology.join(", ")}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{exp.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
