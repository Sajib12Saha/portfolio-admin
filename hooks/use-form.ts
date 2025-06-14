import { useForm as useReactHookForm, UseFormReturn, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodTypeAny } from "zod";


export const useForm = <T extends ZodTypeAny>(
  schema: T,
  defaultValues?: DefaultValues<z.infer<T>>
): UseFormReturn<z.infer<T>> => {
  return useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
};
