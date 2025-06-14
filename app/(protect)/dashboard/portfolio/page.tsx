"use client";

import { useState } from "react";
import { useCustomMutation } from "@/hooks/use-mutation";
import { useCustomQuery } from "@/hooks/use-query";
import {
  getPortfolios,
  deletePortfolio,
  PaginatedPortfolioResponse,
} from "@/actions/portfolio";
import { PortfolioTable } from "@/components/data-table/portfolio-table";
import { Portfolioform } from "@/components/form/portfolio-form";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PortfolioPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: portfolios,
    isLoading,
    error,
  } = useCustomQuery<PaginatedPortfolioResponse>(
    ["get-portfolio", currentPage],
    () => getPortfolios(currentPage)
  );

  const { mutate: handleDelete, isPending } = useCustomMutation(
    ["delete-portfolio"],
    deletePortfolio,
    ["get-portfolio", currentPage]
  );

  const totalPages = portfolios?.totalPages ?? 1;

  return (
    <div className="space-y-8">
      <div className="max-w-lg space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">Portfolio Setup</h2>
        <p className="text-base text-muted-foreground">
       প্রকল্প সম্পূর্ণ করুন এবং পরিচালনা করুন যা আপনার দক্ষতা এবং কাজের মূল্য প্রকাশ করে। প্রকল্পগুলো ক্লায়েন্টদের আকর্ষণ করতে সাহায্য করে আপনার কাজের ধরন, মূল্য নির্ধারণ এবং কী প্রত্যাশা করা যায় তা স্পষ্টভাবে তুলে ধরার মাধ্যমে। এই ফর্মটি ব্যবহার করে আপনার প্রকল্পগুলো সেটআপ করুন এবং প্রকাশ করুন।
        </p>
      </div>

      <Portfolioform />

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center w-full">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-destructive">Error loading portfolios</p>
      ) : (
        <>
          <PortfolioTable
            data={portfolios?.data ?? []}
            onDelete={(id, onSuccess) =>
              handleDelete(id, {
                onSuccess,
              })
            }
            isPending={isPending}
          />

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <Button
             
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
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

export default PortfolioPage;
