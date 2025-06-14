'use client';

import { fetchProfile, removeProfile } from "@/actions/profile";
import { ProfileCard } from "@/components/data-card/profile-card";
import { Profileform } from "@/components/form/profile-form";
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
import { ResponseProfileType } from "@/types/type";
import { AlertTriangle, Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

const ProfilePage = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: profile,
    isLoading,
    error,
  } = useCustomQuery<ResponseProfileType>(["get-profile"], fetchProfile);

  const { mutate: deleteProfile, isPending } = useCustomMutation(
    ["delete-profile"],
    removeProfile,
    ["get-profile"],
  );

  const handleDelete = () => {
    deleteProfile(profile?.id as string, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-lg space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">Profile Setup</h2>
        <p className="text-base text-muted-foreground">
    আপনার প্রোফাইল সম্পূর্ণ করুন এবং আপনার ব্যক্তিগত ব্র্যান্ড তুলে ধরুন। একটি পূর্ণাঙ্গ প্রোফাইল অন্যদের বুঝতে সাহায্য করে আপনি কে। এই তথ্য আপনার ড্যাশবোর্ড, পোর্টফোলিও এবং পাবলিক ভিউতে ব্যবহৃত হতে পারে।
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
      ) : isEditing && profile ? (
        <Profileform defaultValues={profile} onCancel={handleCancel} />
      ) : profile ? (
        
        <div className="space-y-4">
          <ProfileCard profile={profile} />
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
                  Are you sure you want to delete profile? This action cannot be undone.
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
        <Profileform />
      )}
    </div>
  );
};

export default ProfilePage;
