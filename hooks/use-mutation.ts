import { queryClient } from "@/provider/queryClient-provider";
import {
  useMutation,
  MutationKey,
  QueryKey,
  MutateFunction,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useCustomMutation = <T>(
  mutationKey: MutationKey,
  mutationFn: (data: T) => Promise<any>,
  queryKey: QueryKey,
  onSuccess?: (data:any) => void
) => {
  const {mutate,isPending,data} =  useMutation({
    mutationKey,
    mutationFn: mutationFn,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey });

      if (onSuccess) {
        onSuccess(data);
      }

      // ✅ Show only server success message
      toast.success(data?.message || "Success");
    },
    onError: (error: any) => {
      // ✅ Extract error message from common API error structure
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";

      toast.error(errorMessage);
    },
  });

  return {
    mutate,isPending,data
  }
};
