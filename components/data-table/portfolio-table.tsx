"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResponsePortfolioInput } from "@/types/type";
import { DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import { AlertTriangle, Edit2, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { Portfolioform } from "../form/portfolio-form";

type Props = {
  data: ResponsePortfolioInput[];
  onDelete?: (id: string, onSuccess: () => void) => void;
  isPending?: boolean;
};

export const PortfolioTable = ({ data, onDelete, isPending }: Props) => {
  const [editPortfolio, setEditPortfolio] = useState<ResponsePortfolioInput | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<ResponsePortfolioInput | null>(null);

  const columns: ColumnDef<ResponsePortfolioInput>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="truncate max-w-24">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "desc",
      header: "Description",
      cell: ({ row }) => (
        <span className="max-w-[200px] line-clamp-2 text-sm text-muted-foreground">
          {row.original.desc}
        </span>
      ),
    },
    {
      accessorKey: "image",
      header: "Portfolio Image",
      cell: ({ row }) => (
        <Image
          width={200}
          height={200}
          key={row.original.id}
          src={row.original.image}
          alt="portfolio"
          className="object-contain rounded-md"
        />
      ),
    },
    {
      accessorKey: "react",
      header: "Reactions",
    },
    {
      accessorKey: "externalLink",
      header: "Link",
      cell: ({ row }) => (
        <a
          href={row.original.externalLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline text-sm break-all max-w-xs line-clamp-2"
        >
          {row.original.externalLink}
        </a>
      ),
    },
    {
      accessorKey: "technology",
      header: "Tech",
      cell: ({ row }) => (
        <div className="flex gap-2 flex-wrap">
          {row.original.technology.map((tech) => (
            <Image
              width={35}
              height={35}
              key={tech.id}
              src={tech.image}
              alt="tech"
              className="size-4 md:size-8 object-contain rounded-full"
            />
          ))}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <p className="text-muted-foreground">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }).format(new Date(row.original.createdAt))}
        </p>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const portfolio = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button size="icon" onClick={() => setEditPortfolio(portfolio)}>
              <Edit2 className="w-4 h-4" />
            </Button>

            {/* Edit Dialog */}
            <Dialog
              open={!!editPortfolio}
              onOpenChange={(open) => {
                if (!open) setEditPortfolio(null);
              }}
            >
              <DialogContent className="h-full overflow-y-auto p-6">
                <DialogTitle className="sr-only">Edit Portfolio</DialogTitle>
                <Portfolioform
                  defaultValues={editPortfolio!}
                  onCancel={() => setEditPortfolio(null)}
                />
              </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setSelectedToDelete(portfolio);
                    setIsDeleteOpen(true);
                  }}
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
                  Are you sure you want to delete this portfolio? This action cannot be undone.
                </p>
                <DialogFooter className="flex justify-end space-x-2 pt-4">
                  <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      selectedToDelete &&
                      onDelete?.(selectedToDelete.id, () => {
                        setIsDeleteOpen(false);
                        setSelectedToDelete(null);
                      })
                    }
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
