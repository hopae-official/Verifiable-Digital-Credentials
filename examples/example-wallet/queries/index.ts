import { testApi } from "@/apis";
import { useQuery } from "@tanstack/react-query";

export const useTestQuery = () => {
  return useQuery({
    queryKey: ['test'],
    queryFn: () => testApi(),
  });
};
