import { fetchGet } from "@/shared/utils/fetchers";
import { useQuery } from "@tanstack/react-query";

const useGetData = <T>(param: { dataKey: string; paramUrl: string }) => {
  return useQuery({
    queryKey: [param.dataKey],
    queryFn: async () => await fetchGet<T>(param.paramUrl),
  });
};

export default useGetData;
