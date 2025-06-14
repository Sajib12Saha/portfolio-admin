"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { TestimonialResponseType } from "@/types/type";
import { format } from "date-fns";
import { AlertTriangle, Edit2, Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { Testimonialsform } from "../form/testimonials-form";



interface Props {
  data: TestimonialResponseType[];
  onDelete?: (id: string, onSuccess: () => void) => void;
  isPending?: boolean;
}

export const TestimonialsTable = ({ data, onDelete, isPending }: Props) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<TestimonialResponseType | null>(null);

  const columns: ColumnDef<TestimonialResponseType>[] = [
    {
      accessorKey: "name",
      header: "Author Name",
      cell: ({ row }) => <span className="font-semibold text-sm">{row.original.name}</span>,
    },
    {
      accessorKey: "authorProfession",
      header: "Author Profession",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.authorProfession}</span>,
    },
    {
      accessorKey: "company",
      header: "Author's Company Name",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.companyName}</span>,
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm line-clamp-3 truncate max-w-[200px]">{row.original.message}</span>
      ),
    },
    {
      accessorKey: "platform",
      header: "Platform",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.platform}</span>,
    },
    {
      accessorKey: "projectTitle",
      header: "Project's Name",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.projectTitle}</span>,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.rating}</span>,
    },
    {
      accessorKey: "image",
      header: "Profile's Image",
      cell: ({ row }) => {
        const imageUrl = row.original.image;
        return (
          <div className="w-20 h-20">
            {imageUrl ? (
              <Image
                width={80}
                height={80}
                src={imageUrl}
                alt="testimonial"
                className="rounded-full object-cover w-full h-full border shadow"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{format(new Date(row.original.startDate), "dd MMM yyyy")}</span>,
    },
    {
      accessorKey: "endDate",
      header: "End",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.endDate ? format(new Date(row.original.endDate), "MMM yyyy") : "Present"}
        </span>
      ),
    },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const testimonial = row.original;

        return (
          <div className="flex items-center gap-2">
            {/* Edit dialog */}
             <Button size="icon" onClick={() => setEditTestimonial(testimonial)}>
              <Edit2 className="w-4 h-4" />
            </Button>

            {/* Controlled Edit Dialog */}
            <Dialog
              open={!!editTestimonial}
              onOpenChange={(open) => {
                if (!open) setEditTestimonial(null);
              }}
            >
              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto p-6">
                <DialogTitle>Edit Testimonial</DialogTitle>
                {editTestimonial && (
                  <Testimonialsform
                    defaultValues={editTestimonial}
                    onCancel={() => setEditTestimonial(null)}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Delete dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
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
                  Are you sure you want to delete this testimonial? This action cannot be undone.
                </p>
                <DialogFooter className="flex justify-end space-x-2 pt-4">
                  <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={() => onDelete?.(testimonial.id, () => setIsDeleteOpen(false))}
                  >
                    {isPending ? <Loader2 className="animate-spin size-4" /> : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
};
