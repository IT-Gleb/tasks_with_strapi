import { fetchGet } from "@/shared/utils/fetchers";
import { useQuery } from "@tanstack/react-query";

const useGetData = <T>(param: {
  dataKey: string;
  paramUrl: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [param.dataKey],
    queryFn: async () => await fetchGet<T>(param.paramUrl),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: param.enabled !== undefined ? param.enabled : true,
  });
};

export default useGetData;
