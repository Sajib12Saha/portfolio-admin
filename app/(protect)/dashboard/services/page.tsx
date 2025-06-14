'use client';

import { deleteService, getServices, PaginatedServicesResponse } from "@/actions/services";
import { ServicesTable } from "@/components/data-table/services-table";
import { Servicesform } from "@/components/form/services-form";
import { Separator } from "@/components/ui/separator";
import { useCustomMutation } from "@/hooks/use-mutation";
import { useCustomQuery } from "@/hooks/use-query";
import { Loader2 } from "lucide-react";

const ServicesPage = () =>{
        const {
          data: services,
          isLoading,
          error,
        } = useCustomQuery<PaginatedServicesResponse>(["get-service", 1],getServices);

           const { mutate: handleDelete, isPending } = useCustomMutation(
              ["delete-service"],
              deleteService,
              ["get-service", 1]
            );
        

    return (
<div className="space-y-8">
  <div className="max-w-lg space-y-2">
    <h2 className="text-2xl md:text-3xl font-bold">Services Setup</h2>
    <p className="text-base text-muted-foreground">
আপনি যেসব সেবা প্রদান করেন তা সংজ্ঞায়িত করুন এবং সম্ভাব্য ক্লায়েন্ট বা সহযোগীদের কাছে প্রচার করুন। এই অংশে আপনি স্পষ্টভাবে আপনার দক্ষতা, মূল্য এবং ক্লায়েন্টরা কী আশা করতে পারে তা জানান দিতে পারবেন। নিচের ফর্মটি ব্যবহার করে আপনার সেবাগুলো তালিকাভুক্ত করুন যাতে সেগুলো সহজেই খুঁজে পাওয়া যায়।
    </p>
  </div>
  
    <Servicesform />
    <Separator/>
            {isLoading ? (
        <div className="flex items-center justify-center w-full "><Loader2 className="size-5 animate-spin"/></div>
      ) : error ? (
        <p className="text-destructive">Error loading Services</p>
      ) : (
        <ServicesTable data={services?.data ?? []} 
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

export default ServicesPage;