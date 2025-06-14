'use client';

import { deleteTestimonial, getTestimonials, PaginatedTestimonialsResponse } from "@/actions/testimonial";
import { TestimonialsTable } from "@/components/data-table/testimonials-table";
import { Testimonialsform } from "@/components/form/testimonials-form";
import { Separator } from "@/components/ui/separator";
import { useCustomMutation } from "@/hooks/use-mutation";
import { useCustomQuery } from "@/hooks/use-query";

import { Loader2 } from "lucide-react";

const TestimonialsPage = () =>{

      const {
        data: testimonials,
        isLoading,
        error,
      } = useCustomQuery<PaginatedTestimonialsResponse>(["get-testimonial", 1],  getTestimonials);

          const { mutate: handleDelete, isPending } = useCustomMutation(
            ["delete-testimonial"],
            deleteTestimonial,
            ["get-testimonial", 1]
          );

    return (
   <div className="space-y-8">
  <div className="max-w-lg space-y-2">
  <h2 className="text-2xl md:text-3xl font-bold">Testimonials Setup</h2>
<p className="text-base text-muted-foreground">
ক্লায়েন্ট, সহকর্মী বা সহযোগীদের কাছ থেকে প্রতিক্রিয়া প্রদর্শন করুন যাতে বিশ্বাসযোগ্যতা ও বিশ্বাস গড়ে ওঠে। এই অংশটি ব্যবহার করুন ইতিবাচক প্রশংসাপত্র তুলে ধরতে, যা আপনার দক্ষতা, পেশাদারিত্ব এবং প্রকল্পে আপনি যে মূল্য যোগ করেন তা জোর দেয়।
</p>

  </div>
    <Testimonialsform />
      <Separator/>

           {isLoading ? (
        <div className="flex items-center justify-center w-full "><Loader2 className="size-5 animate-spin"/></div>
      ) : error ? (
        <p className="text-destructive">Error loading testimonials</p>
      ) : (
        <TestimonialsTable data={testimonials?.data ?? []} 
                onDelete={(id, onSuccess) =>
            handleDelete(id, {
              onSuccess,
            })
          }
          isPending={isPending}
        />
      )}

</div>

    )
}

export default TestimonialsPage;