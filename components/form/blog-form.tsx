"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

import { useForm } from "@/hooks/use-form";
import { Card, CardContent } from "../ui/card";
import { Form, FormField, FormLabel } from "../ui/form";
import { CustomForm } from "./custom-form";
import { blogFormSchema } from "@/lib/zod-schema";
import { z } from "zod";
import { Button } from "../ui/button";
import { BlogInput, ResponseBlogInput } from "@/types/type";
import { useCustomMutation } from "@/hooks/use-mutation";
import { createBlog, updateBlog } from "@/actions/blog";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import { GoStarFill } from "react-icons/go";
import { supabaseClient } from "@/lib/supabase-client";

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface Props {
  defaultValue?: ResponseBlogInput;
  onCancel?: () => void;
}

export const Blogform = ({ defaultValue, onCancel }: Props) => {
  const form = useForm(blogFormSchema, {
    title: defaultValue?.title || "",
    content: defaultValue?.content || "",
    image: defaultValue?.image || undefined,
  });

  useEffect(() => {
    if (defaultValue) {
      form.reset({
        title: defaultValue.title,
        content: defaultValue.content,
        image: defaultValue.image || undefined,
      });
    }
  }, [defaultValue, form]);

  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createMutate, isPending: createPending } = useCustomMutation(
    ["create-blog"],
    createBlog,
    ["get-blog"],
    () => {
      form.reset({
        title: "",
        content: "",
        image: null,
      });
      setIsUploading(false);
    }
  );

  const { mutate: updateMutate, isPending: updatePending } = useCustomMutation(
    ["update-blog"],
    (payload: { data: BlogInput; blogId: string }) =>
      updateBlog(payload.data, payload.blogId),
    ["get-blog"],
    () => {
      setIsUploading(false);
      onCancel?.();
    }
  );

  const onCancelSubmit = () => {
    form.reset();
    onCancel?.();
  };

  const handleContentChange = (value: string) => {
    form.setValue("content", value, { shouldDirty: true });
  };

  const onSubmit = async () => {
    try {
      setIsUploading(true);

      const data = form.getValues();
      let imageUrl = "";

      if (data.image instanceof File) {
        const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
        if (!bucketName) throw new Error("Supabase bucket name not configured");

        const filePath = `${Date.now()}-${data.image.name}`;
        const { error: uploadError } = await supabaseClient.storage
          .from(bucketName)
          .upload(filePath, data.image, {
            cacheControl: "3600",
            upsert: false,
            contentType: data.image.type,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath);
        if (!publicUrl) throw new Error("Failed to get public URL for blog image");

        imageUrl = publicUrl;
      } else if (typeof data.image === "string" && data.image.length > 0) {
        imageUrl = data.image;
      } else {
        throw new Error("Image is required.");
      }

      const sanitizedContent = DOMPurify.sanitize(data.content, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
          "p", "br", "b", "strong", "i", "em", "u", "s", "ul", "ol", "li",
          "h1", "h2", "h3", "blockquote", "code", "pre", "div", "span", "a",
        ],
        ALLOWED_ATTR: ["class", "href", "target", "rel"],
      });

      const finalData: BlogInput = {
        title: data.title,
        content: sanitizedContent,
        image: imageUrl,
      };

      if (defaultValue?.id) {
        updateMutate({ data: finalData, blogId: defaultValue.id });
      } else {
        createMutate(finalData);
      }
    } catch (error) {
      console.error("Blog submit error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = isUploading || createPending || updatePending;

  return (
    <div className="space-y-2 max-w-5xl w-full mx-auto">
      <h3 className="text-lg md:text-xl font-semibold">Blog Form</h3>
      <Card className="w-full">
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
                    placeHolder="Title for your blog"
                    important
                  />
                )}
              />

              <div className="space-y-2 w-full max-w-5xl">
                <FormLabel className="flex items-center gap-x-2 text-base">
                  Content
                  <div className="shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.16)] p-0.5 rounded-full">
                    <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
                  </div>
                </FormLabel>

                <div className="w-full max-w-5xl overflow-hidden">
                  <RichTextEditor
                    value={form.watch("content")}
                    onChange={handleContentChange}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="image"
                    label="Image"
                    previewImage={defaultValue?.image}
                    important
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
                  ) : defaultValue?.id ? "Save Changes" : "Publish"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
