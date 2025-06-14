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
      setIsUploading(true)

      const formData = new FormData()

      // Append all new images for upload
      data.sectors.forEach((sector, sectorIndex) => {
        sector.skills.forEach((skill, skillIndex) => {
          if (skill.image instanceof File) {
            formData.append(
              `sector[${sectorIndex}].skill[${skillIndex}].image`,
              skill.image
            )
          }
        })
      })

      // Upload images to server (api/upload)
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('File upload failed')

      const uploadResults = await uploadRes.json()

      // Build final payload with uploaded image URLs or fallback to old string URLs
      const finalData: AllSkillsInput = data.sectors.map((sector, sectorIndex) => {
        const updatedSkills: SkillInput[] = sector.skills.map((skill, skillIndex) => {
          const key = `sector[${sectorIndex}].skill[${skillIndex}].image`
          const uploaded = uploadResults[key]

          return {
            name: skill.name,
            desc: skill.desc,
            image: uploaded?.publicUrl || (skill.image as string),
          }
        })

        return {
          title: sector.title,
          skills: updatedSkills,
        }
      })

     

      if (defaultValues?.[0]?.id) {
        const oldData: AllSkillsInput = defaultValues.map((sector) => ({
          title: sector.name,
          skills: sector.skills.map((skill) => ({
            name: skill.name,
            desc: skill.desc,
            image: skill.skillImage,
          })),
        }))

        update({ newData: finalData, oldData })
      } else {
        create(finalData)
      }
    } catch (error) {
      console.error('Error submitting skills:', error)
      toast.error('Submission failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

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
