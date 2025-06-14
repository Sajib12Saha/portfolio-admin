'use client'

import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { FormField } from "../ui/form"
import { X } from "lucide-react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { CustomForm } from "./custom-form"

interface SectorFieldProps {
  form: UseFormReturn<any>
  index: number
  removeSector: (index: number) => void
   previewImage?: (sectorIndex: number, skillIndex: number) => string | undefined
}

export const SectorField = ({ form, index, removeSector, previewImage }: SectorFieldProps) => {
  const { control } = form

  const {
    fields: skillFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sectors.${index}.skills`,
  })

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-base">Sector {index + 1}</h4>
          <Button type="button" size="icon" onClick={() => removeSector(index)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <FormField
          control={control}
          name={`sectors.${index}.title`}
          render={({ field }) => (
            <CustomForm
              field={field}
              label="Sector Title"
              fieldType="input"
              placeHolder="e.g. Libraries"
              important
            />
          )}
        />

        <div className="space-y-4">
          {skillFields.map((skill, ki) => (
            <Card key={skill.id}>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Skill {ki + 1}</span>
                  <Button type="button" size="icon" onClick={() => remove(ki)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <FormField
                  control={control}
                  name={`sectors.${index}.skills.${ki}.name`}
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      label="Skill Name"
                      placeHolder="e.g. React"
                      important
                    />
                  )}
                />

                <FormField
                  control={control}
                  name={`sectors.${index}.skills.${ki}.desc`}
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="textarea"
                      label="Skill Description"
                      placeHolder="e.g. A JS framework for building UI"
                      important
                    />
                  )}
                />

                <FormField
                  control={control}
                  name={`sectors.${index}.skills.${ki}.image`}
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="image"
                      label="Skill Image"
                      important
                      previewImage={previewImage ? previewImage(index, ki) : undefined}
                    />
                  )}
                />
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            onClick={() => append({ name: "", desc: "", image: null })}
          >
            + Add Skill
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
