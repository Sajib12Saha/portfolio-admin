'use client'

import { useForm } from "@/hooks/use-form"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Form, FormField, FormItem, FormLabel } from "../ui/form"
import { CustomForm } from "./custom-form"
import { z } from "zod"
import { pricingFormSchema } from "@/lib/zod-schema"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { GoStarFill } from "react-icons/go"
import { createGig, ResponsePricingInput, updateGig } from "@/actions/gig"
import { useCustomMutation } from "@/hooks/use-mutation"
import { OrderFeature } from "./order-feature"
import { useFieldArray } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { PricingInput } from "@/types/type"

type GigFormValues = z.infer<typeof pricingFormSchema>

interface Props {
  defaultValues?: ResponsePricingInput
  onCancel?: () => void
}

export const Gigform = ({ defaultValues, onCancel }: Props) => {
  const form = useForm(pricingFormSchema, {
    basic: {
      title: defaultValues?.basic.title || "",
      desc: defaultValues?.basic.desc || "",
      price: defaultValues?.basic.price || 0,
      features:
        defaultValues?.basic?.features?.map((f) => ({ value: f })) || [],
    },
    standard: {
      title: defaultValues?.standard.title || "",
      desc: defaultValues?.standard.desc || "",
      price: defaultValues?.standard.price || 0,
      features:
        defaultValues?.standard?.features?.map((f) => ({ value: f })) || [],
    },
    premium: {
      title: defaultValues?.premium.title || "",
      desc: defaultValues?.premium.desc || "",
      price: defaultValues?.premium.price || 0,
      features:
        defaultValues?.premium?.features?.map((f) => ({ value: f })) || [],
    },
    orderLink: defaultValues?.orderLink || "",
  })

  const { mutate, isPending } = useCustomMutation(
    ["create-gig"],
    createGig,
    ["get-gig"],
    () => {
      form.reset()
    }
  )

    const { mutate:update, isPending:updatePending } = useCustomMutation(
    ["update-gig"],
        (payload: {  data: PricingInput, gigId: string; }) =>
          updateGig(payload.data, payload.gigId),   
    ["get-gig"],
    () => {
      form.reset()
      onCancel?.()
    }
  )


  const onSubmit = (data: GigFormValues) => {
    try {
      if(defaultValues?.id){
        update({data, gigId:defaultValues.id})
      } else{
     mutate(data)
      }
 
    } catch (error) {
      console.error("Error submitting gigs:", error)
      toast.error("Submission failed. Please try again.")
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg md:text-xl font-semibold">Gig Form</h3>
      <Card className="max-w-3xl">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <Tabs defaultValue="basic">
                <TabsList className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                </TabsList>

                {(["basic", "standard", "premium"] as const).map((tier) => {
                  const { fields, append, remove } = useFieldArray({
                    control: form.control,
                    name: `${tier}.features`,
                  })

                  return (
                    <TabsContent value={tier} key={tier}>
                      <div className="space-y-4 p-1">
                        <h3 className="text-lg font-semibold capitalize">
                          {tier} Package
                        </h3>

                        <FormField
                          control={form.control}
                          name={`${tier}.title`}
                          render={({ field }) => (
                            <CustomForm
                              field={field}
                              fieldType="input"
                              label={`${tier} Title`}
                              placeHolder="title for your gig"
                              important
                            />
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`${tier}.desc`}
                          render={({ field }) => (
                            <CustomForm
                              field={field}
                              fieldType="textarea"
                              label={`${tier} Description`}
                              placeHolder="write about your gig..."
                              important
                            />
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`${tier}.price`}
                          render={({ field }) => (
                            <CustomForm
                              field={field}
                              fieldType="input"
                              inputType="number"
                              label={`${tier} Price`}
                              placeHolder="$30.00"
                              important
                            />
                          )}
                        />

                        <FormItem>
                          <FormLabel className="text-base font-semibold flex gap-x-2 items-center">
                            Features
                            <div className="shadow p-0.5 rounded-full">
                              <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
                            </div>
                          </FormLabel>

                          <OrderFeature
                            fields={fields}
                            append={append}
                            remove={remove}
                            error={
                              form.formState.errors?.[tier]?.features
                                ?.message as string
                            }
                          />
                        </FormItem>
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>

              <FormField
                control={form.control}
                name="orderLink"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="input"
                    label="Order Link"
                    placeHolder="https://example.com"
                  />
                )}
              />

              <div className="flex justify-between gap-2 w-full">
                {onCancel && (
                  <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                )}
      <Button
  type="submit"
  variant={"primary"}
  disabled={isPending}
>
  {isPending ? (
    <Loader2 className="size-4 animate-spin" />
  ) : defaultValues?.id ? (
    "Save Changes"
  ) : (
    "Publish"
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
