'use client'

import { Button } from "../ui/button"
import { UseFormReturn } from "react-hook-form"
import { SectorField } from "./sector-field"


interface SkillSectorFeatureProps {
  form: UseFormReturn<any>
  fields: any[]
  appendSector: () => void
  removeSector: (index: number) => void
previewImage?: (sectorIndex: number, skillIndex: number) => string | undefined
}

export const SkillSectorFeature = ({
  form,
  fields,
  appendSector,
  removeSector,
  previewImage
}: SkillSectorFeatureProps) => {
  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <SectorField
          key={field.id}
          index={index}
          form={form}
          removeSector={removeSector}
   previewImage={(sectorIndex: number, skillIndex: number) =>
  previewImage ? previewImage(sectorIndex, skillIndex) : undefined
}

        />
      ))}

      <Button type="button" onClick={appendSector}>
        + Add Sector
      </Button>
    </div>
  )
}
