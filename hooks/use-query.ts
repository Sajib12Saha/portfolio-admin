import { useQuery, QueryFunction, QueryKey, UseQueryResult } from "@tanstack/react-query";

export const useCustomQuery = <T>(queryKey: QueryKey, queryFunction: QueryFunction<T>): UseQueryResult<T> => {
  return useQuery({
    queryKey,
    queryFn: queryFunction,
  });
};
