"use client";

import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/use-form";
import { useCustomMutation } from "@/hooks/use-mutation";
import { useCustomQuery } from "@/hooks/use-query";
import { getSkill } from "@/actions/skill";
import { createPortfolio, updatePortfolio } from "@/actions/portfolio";
import { portfolioFormSchema } from "@/lib/zod-schema";
import { PortfolioInput, ResponsePortfolioInput, SkillTypeResponse } from "@/types/type";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Form, FormField, FormItem } from "../ui/form";
import { CustomForm } from "./custom-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { supabaseClient } from "@/lib/supabase-client";



interface Props {
  defaultValues?:ResponsePortfolioInput
  onCancel?:() =>void
}

export const Portfolioform = ({defaultValues, onCancel}:Props) => {
  const form = useForm(portfolioFormSchema,  {
    title:defaultValues?.title || "",
    desc:defaultValues?.desc ||  "",
    externalLink:defaultValues?.externalLink || "", 
    react:defaultValues?.react ||  1,         
    image:defaultValues?.image ||  undefined, 
    technology:defaultValues?.technology ||  [{ image: "" }], 
  
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "technology",
  });

  const { data: skillTypes, isLoading: skillLoading, error: skillError } =
    useCustomQuery<SkillTypeResponse[]>(["get-skills"], getSkill);

  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending } = useCustomMutation(
    ["create-portfolio"],
    createPortfolio,
    ["get-portfolio"],
    () => {
      form.reset({
        image:null
      });
      setIsUploading(false);
    }
  );
    const { mutate:update, isPending:updatePending } = useCustomMutation(
    ["update-portfolio"],
    (payload: {  data:PortfolioInput , profileId: string; }) =>
                  updatePortfolio(payload.data, payload.profileId),  
    ["get-portfolio"],
    () => {
      form.reset();
      setIsUploading(false);
      onCancel?.()
    }
  );

  const onCancelSubmit = () =>  {
     form.reset();
    onCancel?.()
  }

const onSubmit = async (data: z.infer<typeof portfolioFormSchema>) => {
  try {
    setIsUploading(true);

    let portfolioImageUrl = defaultValues?.image || "";
    const isUpdating = !!defaultValues;
    const isNewImage = typeof data.image !== "string";

    if (isNewImage && data.image instanceof File) {
      const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
      if (!bucketName) throw new Error("Supabase bucket name not configured");

      // Upload portfolio image to Supabase
      const filePath = `${Date.now()}-${data.image.name}`;
      const { error: uploadError } = await supabaseClient.storage
        .from(bucketName)
        .upload(filePath, data.image, {
          cacheControl: "3600",
          upsert: false,
          contentType: data.image.type,
        });

      if (uploadError) throw uploadError;

      const { data: {publicUrl} } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath);

      if (!publicUrl) throw new Error("Failed to get public URL for portfolio image");

      portfolioImageUrl = publicUrl;
    }

    const techImages = data.technology.map((tech) => ({
      image: tech.image,
    }));

    const finalData: PortfolioInput = {
      title: data.title,
      desc: data.desc,
      image: portfolioImageUrl,
      react: data.react,
      externalLink: data.externalLink,
      technology: techImages,
    };

    if (isUpdating) {
      update({ data: finalData, profileId: defaultValues.id });
    } else {
      mutate(finalData);
    }
  } catch (error) {
    console.error("Error submitting portfolio:", error);
    toast.error("Submission failed. Please try again.");
  } finally {
    setIsUploading(false);
  }
};




  const isLoading = isPending || isUploading;

  return (
    <div className="space-y-2 relative">
      <h3 className="text-lg md:text-xl font-semibold">Portfolio Form</h3>
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
                    placeHolder="Title for your project"
                    important
                  />
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="react"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      inputType="number"
                      label="Project React"
                      placeHolder="2000"
                      important
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="externalLink"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Project Link"
                      placeHolder="https://example.com"
                    />
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="textarea"
                    label="Project Description"
                    placeHolder="Write about your project..."
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
                    label="Project Image"
                    previewImage={defaultValues?.image}
                    important
                  />
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium">Technologies</h4>
                  <Button
                    type="button"
                    onClick={() => append({ image: "" })}
                    size="sm"
                    disabled={isLoading}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Technology
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id} className="border-muted">
                    <CardContent className="pt-6 pb-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold text-muted-foreground">
                          Technology #{index + 1}
                        </h5>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          size="icon"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name={`technology.${index}.image`}
                        render={({ field }) => (
                          <FormItem className="mt-4 w-full">
                            <Controller
                              control={form.control}
                              name={`technology.${index}.image`}
                              render={({ field: controllerField }) => (
                                <Select
                                  onValueChange={controllerField.onChange}
                                  value={controllerField.value}
                                  disabled={isLoading || skillLoading}
                                  
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Skill" />
                                  </SelectTrigger>
                                  <SelectContent className="w-full">
                                    {skillLoading ? (
                                      <div className="p-2 text-center text-sm text-muted-foreground">
                                        Loading skills...
                                      </div>
                                    ) : skillError ? (
                                      <div className="p-2 text-center text-sm text-red-500">
                                        Failed to load skills
                                      </div>
                                    ) : (
                                      skillTypes?.map((skillType) => (
                                        <SelectGroup
                                          key={skillType.id}
                                        >
                                          {skillType.skills.map((skill) => (
                                            <SelectItem
                                              key={skill.id}
                                              value={skill.skillImage}
                                            >
                                              {skill.name}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {form.formState.errors.technology?.[index]?.image && (
                              <p className="text-red-600 text-sm mt-1">
                                {form.formState.errors.technology[index].image?.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

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
