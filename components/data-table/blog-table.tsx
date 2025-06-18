'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ResponseBlogInput } from '@/types/type';
import { DataTable } from '../ui/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2, Edit2, AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Blogform } from '../form/blog-form';

type Props = {
  data: ResponseBlogInput[];
  onDelete?: (id: string, onSuccess: () => void) => void;
  isPending?: boolean;
};

export const BlogTable = ({ data, onDelete, isPending }: Props) => {
  const [editBlog, setEditBlog] = useState<ResponseBlogInput | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<ResponseBlogInput | null>(null);

  const columns: ColumnDef<ResponseBlogInput>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: 'content',
      header: 'Content',
      cell: ({ row }) => {
        const { content } = row.original;
        return (
          <div
            className="max-w-xs line-clamp-3 text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      },
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <Image
          width={400}
          height={200}
          src={row.original.image}
          alt="Blog"
          className="h-12 w-12 rounded object-cover"
          priority={false}
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).format(date);
      },
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const blog = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button size="icon" onClick={() => setEditBlog(blog)}>
              <Edit2 className="w-4 h-4" />
            </Button>

            {/* Edit Dialog */}
            <Dialog open={!!editBlog} onOpenChange={(open) => !open && setEditBlog(null)}>
              <DialogContent
                className="h-full p-2 overflow-y-auto relative"
     
              >
                <DialogHeader>
                  <DialogTitle className='sr-only'>Edit Blog</DialogTitle>
                </DialogHeader>
                {editBlog && (
                  <Blogform
                    defaultValue={editBlog}
                    onCancel={() => setEditBlog(null)}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setSelectedToDelete(blog);
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
                  Are you sure you want to delete this blog? This action cannot be undone.
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
                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm'}
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
