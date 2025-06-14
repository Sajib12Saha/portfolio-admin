'use client'

import { fetchGig, removeGig, ResponsePricingInput } from "@/actions/gig";
import { GigCard } from "@/components/data-card/gig-card";
import { Gigform } from "@/components/form/gig-form";
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
import { AlertTriangle, Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

const GigPage = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: gig,
    isLoading,
    error,
  } = useCustomQuery<ResponsePricingInput>(["get-gig"], fetchGig);

  const { mutate: deleteGig, isPending } = useCustomMutation(
    ["delete-gig"],
    removeGig,
    ["get-gig"]
  );

  const handleDelete = () => {
    deleteGig(gig?.id as string, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-lg space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">Gig Setup</h2>
        <p className="text-base text-muted-foreground">
      আপনার দক্ষতা ও মূল্য প্রদর্শনের জন্য সার্ভিস ভিত্তিক অফার তৈরি ও পরিচালনা করুন। গিগস (Gigs) আপনাকে ক্লায়েন্ট আকৃষ্ট করতে সাহায্য করে, কারণ এতে আপনি পরিষ্কারভাবে তুলে ধরতে পারেন আপনি কী করেন, আপনার মূল্য এবং ক্লায়েন্টরা কী আশা করতে পারে। নিচের ফর্ম ব্যবহার করে আপনার গিগ সেটআপ করুন এবং প্রকাশ করুন।
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
      ) : isEditing && gig ? (
        <Gigform defaultValues={gig} onCancel={handleCancel} />
      ) : gig ? (
        <div className="space-y-4">
          <GigCard gig={gig} />
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
                  Are you sure you want to delete this gig? This action cannot be undone.
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
        <Gigform />
      )}
    </div>
  );
};

export default GigPage;
