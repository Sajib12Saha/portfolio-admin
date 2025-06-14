"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ServiceResponseType } from "@/types/type";
import { DataTable } from "../ui/data-table";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { AlertTriangle, Edit2, Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Servicesform } from "../form/services-form";

interface Props {
  data: ServiceResponseType[];
  onDelete?: (id: string, onSuccess: () => void) => void;
  isPending?: boolean;
}

export const ServicesTable = ({ data, onDelete, isPending }: Props) => {
  // State for delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // State for edit dialog and which service is being edited
  const [editService, setEditService] = useState<ServiceResponseType | null>(null);

  const columns: ColumnDef<ServiceResponseType>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-semibold text-sm">{row.original.title}</span>,
    },
    {
      accessorKey: "desc",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm max-w-[250px] truncate line-clamp-2">
          {row.original.desc}
        </span>
      ),
    },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => (
        <ul className="list-disc line-clamp-2 max-w-[200px] ml-4 text-muted-foreground text-sm space-y-1">
          {row.original.services.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.original.createdAt), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const blog = row.original;

        return (
          <div className="flex items-center gap-2">
            {/* Edit Button: Open dialog by setting editService */}
            <Button size="icon" onClick={() => setEditService(blog)}>
              <Edit2 className="w-4 h-4" />
            </Button>

            {/* Controlled Edit Dialog */}
            <Dialog
              open={!!editService}
              onOpenChange={(open) => {
                if (!open) setEditService(null);
              }}
            >
              <DialogContent className=" h-full overflow-y-auto p-6">
                <DialogTitle className="sr-only">Edit Services</DialogTitle>
                <Servicesform
                  defultValues={editService!}
                  onCancel={() => setEditService(null)} // Pass cancel handler here
                />
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
                  Are you sure you want to delete this Service? This action cannot be undone.
                </p>
                <DialogFooter className="flex justify-end space-x-2 pt-4">
                  <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={() => onDelete?.(blog.id, () => setIsDeleteOpen(false))}
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
