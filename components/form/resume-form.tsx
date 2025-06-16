'use client';

import { z } from 'zod';
import {
  useForm as useReactHookForm,
  useFieldArray,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Form, FormField, FormItem, FormLabel } from '../ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CustomForm } from './custom-form';
import { useCustomMutation } from '@/hooks/use-mutation';
import { createResume, updateResume } from '@/actions/resume';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { resumeFormSchema } from '@/lib/zod-schema';
import { GoStarFill } from 'react-icons/go';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ExperienceItem } from './experience-item';
import { ResumeInputType } from '@/types/type';

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

interface Props {
  defaultValues?:ResumeInputType
   onCancel?: () => void
}

export const ResumeForm = ({defaultValues, onCancel}:Props) => {
  const form = useReactHookForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      educationSchema:defaultValues?.education.map((edu)=>({
        degree:edu.degree,
        institution:edu.institution,
        cgpa:edu.cgpa,
        desc:edu.desc,
        startYear:edu.startYear,
        endYear:edu.endYear,
      }) ) ||[
        {
          degree:'',
          institution: '',
          cgpa: undefined,
          desc: '',
          startYear: '',
          endYear: '',
        },
      ],
      experienceSchema:defaultValues?.experience.map((exp)=> ({
        profession:exp.profession,
        company:exp.company,
        desc:exp.desc,
        technology:exp.technology.map((tech)=> ({value:tech}))
      })) || [
        {
          profession: '',
          company: '',
          desc: '',
          technology: [],
        },
      ],
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: 'educationSchema',
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: 'experienceSchema',
  });

  const { mutate, isPending } = useCustomMutation(
    ['create-resume'],
    createResume,
    ['get-resume'],
    () => form.reset()
  );

   const { mutate:update, isPending:udpatePending } = useCustomMutation(
    ['update-resume'],
    (payload:{ data:ResumeFormValues, resumeId:string,})=>  updateResume(payload.data, payload.resumeId),
    ['get-resume'],
    () =>{
  form.reset();
    onCancel?.();
    } 
  );

    const cancelSubmit = () =>{
    onCancel?.(); 
  form.reset();
  }


const isLoading = isPending || udpatePending;

const onSubmit = (data: ResumeFormValues) => {
  try {
    if (defaultValues?.id) {
      update({
        data: {
          educationSchema: data.educationSchema.map((edu, i) => ({
            ...edu,
            id: defaultValues.education[i]?.id,
            resumeId: defaultValues.id,
          })),
          experienceSchema: data.experienceSchema.map((exp, i) => ({
            id: defaultValues.experience[i]?.id,
            resumeId: defaultValues.id,
            company: exp.company,
            desc: exp.desc,
            profession: exp.profession,
            technology: exp.technology.map(t =>({value:t.value}) ),
          })),
        },
        resumeId: defaultValues.id,
      });
    } else {
      mutate(data);
    }
  } catch {
    toast.error('Submission failed. Please try again.');
  }
};



  return (
    <div className="space-y-2 relative">
      <h3 className="text-lg md:text-xl font-semibold">Resume Form</h3>
      <Card className="max-w-3xl">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="education">
                <TabsList className="grid grid-cols-2 gap-4">
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                </TabsList>

                <TabsContent value="education">
                  <div className="space-y-4 p-1 md:p-4">
                    <h3 className="text-lg font-semibold">Education</h3>
                    {educationFields.map((_, index) => (
                      <Card key={index}>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Education {index + 1}</h4>
                            <Button
                              type="button"
                              size="icon"
                              onClick={() => removeEducation(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          <FormField
                            control={form.control}
                            name={`educationSchema.${index}.degree`}
                            render={({ field }) => (
                              <CustomForm
                                field={field}
                                label="Degree"
                                fieldType="input"
                                placeHolder="Bachelor of Social Science in Economics"
                                important
                              />
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`educationSchema.${index}.institution`}
                            render={({ field }) => (
                              <CustomForm
                                field={field}
                                label="Institution"
                                fieldType="input"
                                placeHolder="National University of Bangladesh"
                                important
                              />
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`educationSchema.${index}.cgpa`}
                            render={({ field }) => (
                              <CustomForm
                                field={field}
                                label="CGPA"
                                fieldType="input"
                                inputType="number"
                                placeHolder="4.50"
                                important
                              />
                            )}
                          />

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <FormField
                              control={form.control}
                              name={`educationSchema.${index}.startYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Start Year
                                    <div className="shadow p-0.5 rounded-full">
                                      <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
                                    </div>
                                  </FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 50 }, (_, i) => {
                                        const year = `${new Date().getFullYear() - i}`;
                                        return (
                                          <SelectItem key={year} value={year}>
                                            {year}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`educationSchema.${index}.endYear`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    End Year
                                    <div className="shadow p-0.5 rounded-full">
                                      <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
                                    </div>
                                  </FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select year or Present" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Present">Present</SelectItem>
                                      {Array.from({ length: 50 }, (_, i) => {
                                        const year = `${new Date().getFullYear() - i}`;
                                        return (
                                          <SelectItem key={year} value={year}>
                                            {year}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`educationSchema.${index}.desc`}
                            render={({ field }) => (
                              <CustomForm
                                field={field}
                                label="Description"
                                fieldType="textarea"
                                important
                                placeHolder='Tell me about your academy activities....'
                              />
                            )}
                          />
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      onClick={() =>
                        appendEducation({
                          degree: '',
                          institution: '',
                          cgpa: 0,
                          desc: '',
                          startYear: '',
                          endYear: '',
                        })
                      }
                    >
                      + Add Education
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="experience">
                  <div className="space-y-4 p-1 md:p-4">
                    <h3 className="text-lg font-semibold">Experience</h3>
                    {experienceFields.map((_, index) => (
                      <ExperienceItem
                        key={index}
                        index={index}
                        control={form.control}
                        removeExperience={removeExperience}
                      />
                    ))}
                    <Button
                      type="button"
                      onClick={() =>
                        appendExperience({
                          profession: '',
                          company: '',
                          desc: '',
                          technology: [],
                        })
                      }
                    >
                      + Add Experience
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

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
    ) : defaultValues?.id ? "Update Resume" : "Create Resume"}
  </Button>
</div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
