import { Control, useFieldArray, UseFieldArrayRemove } from 'react-hook-form';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { FormField, FormItem, FormLabel } from '../ui/form';
import { CustomForm } from './custom-form';
import { OrderFeature } from './order-feature';
import { GoStarFill } from 'react-icons/go';
import { resumeFormSchema } from '@/lib/zod-schema';
import { z } from 'zod';

type ResumeFormValues = z.infer<typeof resumeFormSchema>;

type ExperienceFieldProps = {
  control: Control<ResumeFormValues>;
  index: number;
  removeExperience: UseFieldArrayRemove;
};

export const ExperienceItem = ({
  control,
  index,
  removeExperience,
}: ExperienceFieldProps) => {
  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({
    control,
    name: `experienceSchema.${index}.technology`,
  });

  const errors =
    control._formState.errors?.experienceSchema?.[index]?.technology as
      | { message?: string }[]
      | undefined;

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Experience {index + 1}</h4>
          <Button type="button" size="icon" onClick={() => removeExperience(index)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <FormField
          control={control}
          name={`experienceSchema.${index}.profession`}
          render={({ field }) => (
            <CustomForm field={field} label="Profession" 
            placeHolder='Next Js Developer'
            fieldType="input" important
             />
          )}
        />
        <FormField
          control={control}
          name={`experienceSchema.${index}.company`}
          render={({ field }) => (
            <CustomForm field={field} label="Company" fieldType="input"
            placeHolder='CodeCrafter Lab'
             important />
          )}
        />
        <FormField
          control={control}
          name={`experienceSchema.${index}.desc`}
          render={({ field }) => (
            <CustomForm field={field} label="Description" 
                placeHolder='Experience with your company...'
            fieldType="textarea" important />
          )}
        />

        <FormItem>
          <FormLabel className="text-base font-semibold flex gap-x-2 items-center">
            Technologies
            <div className="shadow p-0.5 rounded-full">
              <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
            </div>
          </FormLabel>

          <OrderFeature
            fields={techFields}
            append={appendTech}
            remove={removeTech}
            error={errors?.[0]?.message}
            placeHolder='Add your Technologies'
          />
        </FormItem>
      </CardContent>
    </Card>
  );
};
