'use client'

import { useState } from 'react'
import { useForm } from '@/hooks/use-form'
import { z } from 'zod'
import { Card, CardContent } from '../ui/card'
import { Form, FormItem, FormLabel } from '../ui/form'
import { Button } from '../ui/button'
import { GoStarFill } from 'react-icons/go'
import { allSkillsFormSchema } from '@/lib/zod-schema'
import { useCustomMutation } from '@/hooks/use-mutation'
import { createSkill, updateSkill } from '@/actions/skill'
import { SkillSectorFeature } from './skill-feature'
import { useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import { AllSkillsInput, SkillInput, SkillTypeResponse } from '@/types/type'
import { Loader2 } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase-client'

interface Props {
  defaultValues?: SkillTypeResponse[]
  onCancel?: () => void
}

export const SkillForm = ({ defaultValues, onCancel }: Props) => {
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm(allSkillsFormSchema, {
    sectors:
      defaultValues?.map((sector) => ({
        title: sector.name,
        skills: sector.skills.map((skill) => ({
          name: skill.name,
          desc: skill.desc,
          image: skill.skillImage,
        })),
      })) || [
        {
          title: '',
          skills: [
            {
              name: '',
              desc: '',
              image: undefined,
            },
          ],
        },
      ],
  })

  const { control, handleSubmit, reset } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sectors',
  })

  const { mutate: create, isPending: createPending } = useCustomMutation(
    ['create-skills'],
    createSkill,
    ['get-skills'],
    () => reset()
  )

  const { mutate: update, isPending: updatePending } = useCustomMutation(
    ['update-skills'],
    (payload: { newData: AllSkillsInput; oldData: AllSkillsInput }) =>
      updateSkill(payload.newData, payload.oldData),
    ['get-skills'],
    () => {
      reset()
      onCancel?.()
    }
  )

const onSubmit = async (data: z.infer<typeof allSkillsFormSchema>) => {
  try {
    setIsUploading(true);

    const isUpdating = !!defaultValues?.[0]?.id;
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!;
    if (!bucketName) throw new Error("Supabase bucket name not configured");

    const finalData: AllSkillsInput = [];

    for (let sectorIndex = 0; sectorIndex < data.sectors.length; sectorIndex++) {
      const sector = data.sectors[sectorIndex];
      const updatedSkills: SkillInput[] = [];

      for (let skillIndex = 0; skillIndex < sector.skills.length; skillIndex++) {
        const skill = sector.skills[skillIndex];
        let imageUrl = typeof skill.image === "string" ? skill.image : "";

        if (skill.image instanceof File) {
          const filePath = `${Date.now()}-${skill.image.name}`;
          const { error: uploadError } = await supabaseClient.storage
            .from(bucketName)
            .upload(filePath, skill.image, {
              cacheControl: "3600",
              upsert: false,
              contentType: skill.image.type,
            });

          if (uploadError) {
            console.warn(`Failed to upload image for ${skill.name}:`, uploadError.message);
            toast.error(`Failed to upload image for ${skill.name}`);
            continue;
          }

          const { data: { publicUrl } } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath);
          if (!publicUrl) throw new Error("Failed to get public URL for skill image");

          imageUrl = publicUrl;
        }

        updatedSkills.push({
          name: skill.name,
          desc: skill.desc,
          image: imageUrl,
        });
      }

      finalData.push({
        title: sector.title,
        skills: updatedSkills,
      });
    }

    if (isUpdating) {
      const oldData: AllSkillsInput = defaultValues.map((sector) => ({
        title: sector.name,
        skills: sector.skills.map((skill) => ({
          name: skill.name,
          desc: skill.desc,
          image: skill.skillImage,
        })),
      }));

      update({ newData: finalData, oldData });
    } else {
      create(finalData);
    }
  } catch (error) {
    console.error("Error submitting skills:", error);
    toast.error("Submission failed. Please try again.");
  } finally {
    setIsUploading(false);
  }
};


const previewImage = (sectorIndex: number, skillIndex: number): string | undefined => {
  const sector = form.getValues(`sectors.${sectorIndex}`);
  if (!sector) return undefined;

  const skill = sector.skills?.[skillIndex];
  if (!skill) return undefined;

  // skill.image can be File or string
  if (typeof skill.image === 'string') {
    return skill.image;
  }

  // If it's a File, you can optionally generate a preview URL:
  // return URL.createObjectURL(skill.image);

  return undefined;
}
  const cancelSubmit = () => {
    onCancel?.()
    reset()
  }

  const isLoading = isUploading || createPending || updatePending

  return (
    <div className="space-y-2 relative">
      <h3 className="text-lg md:text-xl font-semibold">Skills Form</h3>

      <Card className="max-w-3xl relative overflow-hidden">
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel className="text-base font-semibold flex gap-x-2 items-center">
                  Skill Sectors
                  <div className="shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.16)] p-0.5 rounded-full">
                    <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
                  </div>
                </FormLabel>

                <SkillSectorFeature
                  form={form}
                  fields={fields}
                  removeSector={remove}
                  appendSector={() => append({ title: '', skills: [] })}
                  previewImage={previewImage}
                />
              </FormItem>

              <div className="flex items-center justify-between w-full gap-4 pt-4">
                {onCancel && (
                  <Button type="button" onClick={cancelSubmit} disabled={isLoading}>
                    Cancel
                  </Button>
                )}

                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploading ? 'Uploading...' : 'Publishing...'}
                    </>
                  ) : defaultValues?.[0]?.id ? (
                    'Update Skills'
                  ) : (
                    'Create Skills'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
