"use client";

import { getSkill,  removeSkillType } from "@/actions/skill";
import { SkillCard } from "@/components/data-card/skill-card";
import { SkillForm } from "@/components/form/skill-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCustomMutation } from "@/hooks/use-mutation";
import { useCustomQuery } from "@/hooks/use-query";
import { SkillTypeResponse } from "@/types/type";
import { AlertTriangle, Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";


const SkillPage = () =>{
    const [open, setOpen] = useState(false);
      const [isEditing, setIsEditing] = useState(false);
      const {
        data: skills,
        isLoading,
        error,
      } = useCustomQuery<SkillTypeResponse[]>(["get-skills"], getSkill);

      
        const { mutate:deleteSkill, isPending } = useCustomMutation(
          ["delete-skills"],
          removeSkillType,
          ["get-skills"],
          
        )

        const handleDeleteAll = () => {
    const ids = skills?.map((s) => s.id) || [];
    deleteSkill(ids, {
      onSuccess: () => setOpen(false),
    });
  };

  
  const handleCancel = () => {
    setIsEditing(false)
  
  }


    return (
           <div className="space-y-8">
          <div className="max-w-lg space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">Skill Setup</h2>
            <p className="text-base text-muted-foreground">
         আপনার দক্ষতা ও বিশেষতাগুলো উপস্থাপন করুন। এই বিভাগে আপনি আপনার বিভিন্ন স্কিলের বিবরণ দিতে পারবেন যা আপনার পেশাদারিত্ব এবং যোগ্যতা তুলে ধরবে। নিচের ফর্মটি ব্যবহার করে আপনার স্কিলগুলো যুক্ত করুন।
            </p>
          </div>
          {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="w-full h-screen flex items-center justify-center">
          <p className="text-destructive">{error.message}</p>
        </div>
      ) : isEditing && skills ? (
        <SkillForm defaultValues={skills} onCancel={handleCancel} />
      ) : skills && skills.length > 0 ? (
        <div className="space-y-4">
          <SkillCard skills={skills} />
          <div className="max-w-2xl flex justify-between items-center">
            <Button onClick={() => setIsEditing(true)}>
              Edit <Edit2 className="size-4 ml-1" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  Delete All <Trash2 className="size-4 ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Confirm Delete
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete all skill types? This action
                  cannot be undone.
                </p>
                <DialogFooter className="flex justify-end space-x-2 pt-4">
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={handleDeleteAll}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <SkillForm defaultValues={[]} onCancel={handleCancel}/>
      )}
        
        </div>
    )
}

export default SkillPage;