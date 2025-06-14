'use client';

import { useState } from 'react';
import { getBlogs, deleteBlog, PaginatedBlogResponse } from '@/actions/blog';
import { Blogform } from '@/components/form/blog-form';
import { BlogTable } from '@/components/data-table/blog-table';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomQuery } from '@/hooks/use-query';
import { useCustomMutation } from '@/hooks/use-mutation';

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: blogs,
    isLoading,
    error,
  } = useCustomQuery<PaginatedBlogResponse>(['get-blog', currentPage], () => getBlogs(currentPage));

  const { mutate: handleDelete, isPending } = useCustomMutation(
    ['delete-blog'],
    deleteBlog,
    ['get-blog', currentPage]
  );

  const totalPages = blogs?.totalPages ?? 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-lg space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">Blog Setup</h2>
        <p className="text-base text-muted-foreground">
        আপনার ভাবনা, ধারণা এবং আপডেট শেয়ার করুন ব্লগ পোস্ট তৈরি করে। ব্লগিং হলো একটি শক্তিশালী মাধ্যম যা আপনাকে আপনার দর্শকদের সাথে সংযোগ স্থাপন করতে, আপনার দক্ষতা প্রদর্শন করতে এবং অনলাইনে আপনার পরিচিতি গড়ে তুলতে সাহায্য করে। নিচের ফর্ম পূরণ করে আপনার পোস্ট প্রকাশ করুন।
        </p>
      </div>

      {/* Blog Form (for creating new blog posts) */}
      <Blogform />

      <Separator />

      {/* Blog Table */}
      {isLoading ? (
        <div className="flex items-center justify-center w-full">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-destructive">Error loading blogs</p>
      ) : (
        <>
          <BlogTable
            data={blogs?.data ?? []}
            onDelete={(id, onSuccess) =>
              handleDelete(id, {
                onSuccess,
              })
            }
            isPending={isPending}
          />

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <Button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPage;
