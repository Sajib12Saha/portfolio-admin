"use client";

import { useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useForm } from "@/hooks/use-form";
import { testimonialFormSchema } from "@/lib/zod-schema";
import { cn } from "@/lib/utils";
import { createTestimonial, updateTestimonial } from "@/actions/testimonial";
import { useCustomMutation } from "@/hooks/use-mutation";
import { TestimonialInput, TestimonialResponseType } from "@/types/type";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CustomForm } from "./custom-form";

interface Props {
  defaultValues?: TestimonialResponseType;
  onCancel?: () => void;
}

export const Testimonialsform = ({ defaultValues, onCancel }: Props) => {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm(testimonialFormSchema, {
    name: defaultValues?.name || "",
    companyName: defaultValues?.companyName || "",
    authorProfession: defaultValues?.authorProfession || "",
    image: defaultValues?.image ?? undefined,
    projectTitle: defaultValues?.projectTitle || "",
    platform: defaultValues?.platform || "",
    message: defaultValues?.message || "",
    rating: defaultValues?.rating || 1,
    startDate: defaultValues?.startDate || undefined,
    endDate: defaultValues?.endDate || undefined,
  });

  const { mutate, isPending } = useCustomMutation(
    ["create-testimonial"],
    createTestimonial,
    ["get-testimonial"],
    () => {
      form.reset({ image: null });
    }
  );

  const { mutate: update, isPending: updatePending } = useCustomMutation(
    ["update-testimonial"],
    (payload: { data: TestimonialInput; testimonialId: string }) =>
      updateTestimonial(payload.data, payload.testimonialId),
    ["get-testimonial"],
    () => {
      form.reset();
      onCancel?.();
    }
  );

  const onCancelSubmit = () => {
    onCancel?.();
    form.reset();
  };

  const onSubmit = async (data: z.infer<typeof testimonialFormSchema>) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      if (data.image instanceof File) {
        formData.append("authorImage", data.image);
      }

      let uploads: { authorImage?: { publicUrl: string } } = {};

      if (formData.has("authorImage")) {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        uploads = await response.json();
      }

      const finalData: TestimonialInput = {
        name: data.name,
        companyName: data.companyName,
        authorProfession: data.authorProfession,
        image:
          uploads.authorImage?.publicUrl ||
          (typeof data.image === "string" ? data.image : defaultValues?.image) ||
          "",
        projectTitle: data.projectTitle,
        platform: data.platform,
        message: data.message,
        rating: data.rating,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      if (!finalData.image) {
        throw new Error("Author image is required.");
      }

      if (defaultValues?.id) {
        update({ data: finalData, testimonialId: defaultValues.id });
      } else {
        mutate(finalData);
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = isUploading || isPending || updatePending;

  return (
    <div className="space-y-2">
      <h3 className="text-lg md:text-xl font-semibold">Testimonial Form</h3>
      <Card className="max-w-3xl">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="input"
                    label="Full Name of Author"
                    placeHolder="Sajib Chandra Saha"
                    important
                  />
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Company Name of Author"
                      placeHolder="Teach Code Learner"
                      important
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorProfession"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Career of Author"
                      placeHolder="Next Js Developer"
                      important
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="projectTitle"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Project Title"
                      placeHolder="Web Development"
                      important
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Platform Name"
                      placeHolder="Upwork"
                      important
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Project Review</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((val) => (
                              <SelectItem key={val} value={val.toString()}>
                                {val}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={cn(
                              "w-full text-left font-medium text-foreground",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick a start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" side="top">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={cn(
                              "w-full text-left font-medium text-foreground",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick an end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" side="top">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="textarea"
                    label="Message of Author"
                    placeHolder="Write author's message..."
                    important
                  />
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="image"
                    label="Author's Image"
                    important
                    previewImage={defaultValues?.image}
                  />
                )}
              />

              <div className="flex justify-end items-center gap-2 pt-4">
                {onCancel && (
                  <Button type="button" onClick={onCancelSubmit}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : defaultValues?.id ? "Save Changes" : "Publish"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
