'use client';

import { getResume, removeResume } from "@/actions/resume";
import { ResumeCard } from "@/components/data-card/resume-card";
import { ResumeForm } from "@/components/form/resume-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCustomMutation } from "@/hooks/use-mutation";
import { useCustomQuery } from "@/hooks/use-query";
import { ResumeInputType } from "@/types/type";
import { AlertTriangle, Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

const ResumePage = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: resume,
    isLoading,
    error,
  } = useCustomQuery<ResumeInputType>(["get-resume"], getResume);

  const { mutate: deleteResume, isPending } = useCustomMutation(
    ["delete-resume"],
    removeResume,
    ["get-resume"]
  );

  const handleDelete = () => {
    deleteResume(resume?.id as string, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-lg space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">Resume Setup</h2>
        <p className="text-base text-muted-foreground">
আপনার অভিজ্ঞতা ও শিক্ষাকে তুলে ধরতে একটি পেশাদার রিজিউম তৈরি করুন। এই অংশে আপনি আপনার পটভূমির একটি স্পষ্ট এবং আকর্ষণীয় সংক্ষিপ্তসার তৈরি করতে পারবেন, যা সম্ভাব্য নিয়োগকর্তা, সহযোগী বা ক্লায়েন্টদের সাথে শেয়ার করা যাবে।
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
      ) : isEditing && resume ? (
        <ResumeForm defaultValues={resume} onCancel={handleCancel} />
      ) : resume ? (
        <div className="space-y-4">
          <ResumeCard resume={resume}/>
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
                  Are you sure you want to delete the resume? This action cannot be undone.
                </p>
                <DialogFooter className="flex justify-end space-x-2 pt-4">
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={handleDelete}
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
        <ResumeForm />
      )}
    </div>
  );
};

export default ResumePage;
