"use client";

import { SkillTypeResponse } from "@/types/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Props {
  skills: SkillTypeResponse[];
}

export const SkillCard = ({ skills }: Props) => {
  return (
    <Tabs defaultValue={skills[0]?.name ?? ""} className="w-full">
      <TabsList className="w-full flex gap-y-2 flex-wrap items-center justify-around rounded-md shadow-md">
        {skills.map((type) => (
          <TabsTrigger
            key={type.id}
            value={type.name}
            className="font-semibold capitalize"
          >
            {type.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {skills.map((type) => (
        <TabsContent key={type.id} value={type.name} className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {type.skills.map((skill) => (
              <Card key={skill.id} className="flex flex-col items-center">
                <CardContent className="space-y-4 flex flex-col items-center justify-center p-6">
                  <Image
                    src={skill.skillImage}
                    alt={skill.name}
                    width={50}
                    height={50}
                    className="overflow-hidden object-contain size-10 md:size-16 shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.8)_inset] dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25)_inset,-1px_-1px_4px_rgba(255,255,255,0.16)_inset] p-1.5 rounded-md"
                  />
                  <h3 className="text-lg md:text-xl font-semibold dark:text-gray-300">
                    {skill.name}
                  </h3>
                  <p className="text-sm md:text-base text-center text-muted-foreground">
                    {skill.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
