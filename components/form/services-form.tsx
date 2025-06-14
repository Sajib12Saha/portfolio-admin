'use client'

import { useForm } from "@/hooks/use-form";
import { Card, CardContent } from "../ui/card"
import { Form, FormField, FormItem, FormLabel } from "../ui/form"
import { CustomForm } from "./custom-form"
import { z } from "zod";
import { serviceSchema } from "@/lib/zod-schema";
import { Button } from "../ui/button";
import { ServiceFeature } from "./service-feature";
import { GoStarFill } from "react-icons/go";
import { createService, updateService } from "@/actions/services";
import { useCustomMutation } from "@/hooks/use-mutation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { OrderFeature } from "./order-feature";
import { ServiceInput, ServiceResponseType } from "@/types/type";


type ServiceFormValues = z.infer<typeof serviceSchema>;

interface Props {
  defultValues?:ServiceResponseType
  onCancel?:()=> void
}

export const Servicesform = ({defultValues, onCancel}:Props) => {

           const form = useForm(serviceSchema, {
                    title:defultValues?.title || "",
                    desc:defultValues?.desc || "",
                    services:defultValues?.services.map((f)=> ({value:f})) || [],
                
                  });

                    const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "services",
  });

                      const { mutate, isPending } = useCustomMutation(
                                  ["create-service"],  
                                  createService,        
                                  ["get-service"],       
                                  () => {
                                  form.reset({
                                    services:[]
                                  })
                                  
                                
                                  }
                                );
                

                           const { mutate:update, isPending:updatePending } = useCustomMutation(
                                  ["update-service"],   
                         (payload: {  data: ServiceInput, profileId: string; }) =>
                           updateService(payload.data, payload.profileId),         
                                  ["get-service"],        
                                  () => {
                                  form.reset()
                                  onCancel?.()
                                  
                                
                                  }
                                );

                                const onCancelSubmit = () => {
                                  onCancel?.();
                                  form.reset();
                                }

const onSubmit = (data: ServiceFormValues) => {
  try {
    if (defultValues?.id) {
      update({ data, profileId: defultValues.id }); // ✅ correctly shaped payload
    } else {
      mutate(data);
    }
  } catch (error) {
    console.error("Error submitting service:", error);
    toast.error("Submission failed. Please try again.");
  }
};

    return (
  <div className="space-y-2">
    <h3 className="text-lg md:text-xl font-semibold">Services Form</h3>
         <Card className="max-w-3xl">
     <CardContent>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

           <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <CustomForm
              field={field}
              fieldType="input"
              label="Title"
              placeHolder="title for your service"
              important
            />
          )}
        />

            <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <CustomForm
              field={field}
              fieldType="textarea"
              label="Service Description"
              placeHolder="write about your service..."
              important
            />
          )}
        />


         <FormItem>
                <FormLabel className="text-base font-semibold flex gap-x-2 items-center">
                  Services
           <div className="shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.16)] p-0.5 rounded-full">
            <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
          </div>
                </FormLabel>
      
                <OrderFeature
                  fields={fields}
                  append={append}
                  remove={remove}
                  error={form.formState.errors?.services?.message as string}
                />
              </FormItem>

 <div className="flex justify-end items-center gap-2 pt-4">
{onCancel && (
  <Button type="button" onClick={onCancelSubmit}>
    Cancel
  </Button>
)}

  <Button
    type="submit"
    variant={"primary"}
    disabled={isPending || updatePending}
  >
    {(isPending || updatePending) ? (
      <Loader2 className="size-4 animate-spin" />
    ) : defultValues?.id ? "Save Changes" : "Publish"}
  </Button>
</div>

    </form>
  </Form>
</CardContent>

    </Card>
  </div>
    )
}