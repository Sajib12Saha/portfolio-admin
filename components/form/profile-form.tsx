"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { GoStarFill } from "react-icons/go";

import { useForm } from "@/hooks/use-form";
import { useCustomMutation } from "@/hooks/use-mutation";
import { profileFormSchema } from "@/lib/zod-schema";
import { createProfile, updateProfile } from "@/actions/profile";
import { ResponseProfileType, ProfileInput } from "@/types/type";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { CustomForm } from "./custom-form";
import { SocialAdder } from "./social-adder";
import { supabaseClient } from "@/lib/supabase";

interface Props {
  defaultValues?: ResponseProfileType;
    onCancel?: () => void;
}

export const Profileform = ({ defaultValues,onCancel }: Props) => {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm(profileFormSchema, {
    name: defaultValues?.name || "",
    email: defaultValues?.email || "",
    phone: defaultValues?.phone || "",
    address: defaultValues?.address || "",
    profession: defaultValues?.profession || "",
    professionBio: defaultValues?.professionBio || "",
    welcomeMessage: defaultValues?.welcomeMessage || "",
    metaDescription: defaultValues?.metaDescription || "",
    socialMedia: defaultValues?.socialMedia || [],
    primaryImage: defaultValues?.primaryImage ?? undefined,
    secondaryImage: defaultValues?.secondaryImage ?? undefined,
    metaImage: defaultValues?.metaImage ?? null,
    openGraphImage: defaultValues?.openGraphImage ?? null,
    twitterImage: defaultValues?.twitterImage ?? null,
  });

  const { mutate, isPending } = useCustomMutation(
    ["create-profile"],
    createProfile,
    ["get-profile"],
    () => form.reset()
  );

const { mutate: update, isPending: updatePending } = useCustomMutation(
  ["update-profile"],
  (payload: { profileId: string; data: ProfileInput }) =>
    updateProfile(payload.profileId, payload.data),
  ["get-profile"],
  () => {
    form.reset();
     onCancel?.(); 

  }
);

const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
  try {
    setIsUploading(true);

    const bucketName = process.env.SUPABASE_BUCKET_NAME!;
    if (!bucketName) throw new Error("Supabase bucket name not configured");

    // Helper to upload one file and return public URL
    async function uploadFile(file: File) {
      const filePath = `${Date.now()}-${file.name}`;
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
      if (error) throw error;
      const { data:{publicUrl} } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath);
      return publicUrl;
    }

    // Object to hold uploaded URLs
    const uploads: Record<string, string | null> = {
      primaryImage: null,
      secondaryImage: null,
      metaImage: null,
      openGraphImage: null,
      twitterImage: null,
    };

    // Upload files if present
    if (data.primaryImage instanceof File)
      uploads.primaryImage = await uploadFile(data.primaryImage);
    if (data.secondaryImage instanceof File)
      uploads.secondaryImage = await uploadFile(data.secondaryImage);
    if (data.metaImage instanceof File)
      uploads.metaImage = await uploadFile(data.metaImage);
    if (data.openGraphImage instanceof File)
      uploads.openGraphImage = await uploadFile(data.openGraphImage);
    if (data.twitterImage instanceof File)
      uploads.twitterImage = await uploadFile(data.twitterImage);

    // Compose final data, falling back to existing URLs or defaultValues
    const finalData: ProfileInput = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      profession: data.profession,
      professionBio: data.professionBio,
      welcomeMessage: data.welcomeMessage,
      socialMedia: data.socialMedia,
      metaDescription: data.metaDescription,
      primaryImage:
        uploads.primaryImage ||
        (typeof data.primaryImage === "string"
          ? data.primaryImage
          : defaultValues?.primaryImage) ||
        "",
      secondaryImage:
        uploads.secondaryImage ||
        (typeof data.secondaryImage === "string"
          ? data.secondaryImage
          : defaultValues?.secondaryImage) ||
        "",
      metaImage:
        uploads.metaImage ||
        (typeof data.metaImage === "string"
          ? data.metaImage
          : defaultValues?.metaImage) ||
        null,
      openGraphImage:
        uploads.openGraphImage ||
        (typeof data.openGraphImage === "string"
          ? data.openGraphImage
          : defaultValues?.openGraphImage) ||
        null,
      twitterImage:
        uploads.twitterImage ||
        (typeof data.twitterImage === "string"
          ? data.twitterImage
          : defaultValues?.twitterImage) ||
        null,
    };

    if (!finalData.primaryImage || !finalData.secondaryImage) {
      throw new Error("Primary and secondary images are required.");
    }

    if (defaultValues?.id) {
      update({ profileId: defaultValues.id, data: finalData });
    } else {
      mutate(finalData);
    }
  } catch (error) {
    console.error("Error submitting profile:", error);
    toast.error("Submission failed. Please try again.");
  } finally {
    setIsUploading(false);
  }
};

  const cancelSubmit = () =>{
    onCancel?.(); 
  form.reset();
  }


  const isLoading = isPending || updatePending || isUploading;

  return (
    <div className="space-y-2 relative">
      <h3 className="text-lg md:text-xl font-semibold">Profile Form</h3>
      <Card className="max-w-3xl">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Full Name"
                      placeHolder="Sajib Chandra Saha"
                      important
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Phone Number"
                      placeHolder="+00823562435"
                      important
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Email"
                      placeHolder="sahasojib0155@gmail.com"
                      important
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Profession"
                      placeHolder="Web Developer"
                      important
                    />
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="input"
                    label="Address"
                    placeHolder="Khagrachari, Chittagong, Bangladesh"
                    important
                  />
                )}
              />

              <FormField
                control={form.control}
                name="welcomeMessage"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="input"
                    label="Welcome Message"
                    placeHolder="Welcome to my world..."
                    important
                  />
                )}
              />

              <FormField
                control={form.control}
                name="professionBio"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="textarea"
                    label="Professional Bio"
                    placeHolder="Write about your professionalism..."
                    important
                  />
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="socialMedia"
                  render={({ field }) => {
                    const error = form.formState.errors.socialMedia;
                    return (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex gap-x-2 items-center">
                          Social Link
                          <div className="shadow p-0.5 rounded-full">
                            <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
                          </div>
                        </FormLabel>
                        <SocialAdder
                          onChange={field.onChange}
                          error={
                            !Array.isArray(error) && typeof error === "object"
                              ? (error as any)?.message
                              : undefined
                          }
                          value={field.value}
                        />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryImage"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="image"
                      label="Primary Image"
                      previewImage={defaultValues?.primaryImage}
                      important
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryImage"
                  render={({ field, fieldState }) => (
                    <CustomForm
                      field={field}
                      fieldType="image"
                      label="Secondary Image"
                      previewImage={defaultValues?.secondaryImage}
                      important
                      error={fieldState.error}
                    />
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="textarea"
                    label="Meta Description"
                    placeHolder="Write about your professionalism..."
                  />
                )}
              />

              <FormField
                control={form.control}
                name="metaImage"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="image"
                    label="Meta Image"
                    previewImage={defaultValues?.metaImage}
                  />
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="openGraphImage"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="image"
                      label="Open Graph Image (1200x630 px)"
                      previewImage={defaultValues?.openGraphImage}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitterImage"
                  render={({ field, fieldState }) => (
                    <CustomForm
                      field={field}
                      fieldType="image"
                      label="X Image (1500x500 px)"
                      previewImage={defaultValues?.twitterImage}
                      error={fieldState.error}
                    />
                  )}
                />
              </div>

      <div className="flex items-center justify-end gap-4 pt-4">
  {onCancel && (
    <Button
      type="button"
      onClick={()=> cancelSubmit()}
      disabled={isLoading}
    >
      Cancel
    </Button>
  )}
  
  <Button
    type="submit"
    variant={"primary"}
    disabled={isLoading}
  >
    {isLoading ? (
      <Loader2 className="size-4 animate-spin" />
    ) : defaultValues?.id ? "Update Profile" : "Create Profile"}
  </Button>
</div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
