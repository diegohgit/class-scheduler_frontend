import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApi } from "../hooks/useApi";


const { request } = useApi();
//Send get request.
const fetchActiveHours = async () => {

  const { response } = await request("GET", 'api/active_hours/', );
  if(response?.data) return response.data[0]
}



//Fetch all chapters.
export const useActiveHours = () => {
  return useQuery({ queryKey:  ["active_hours"],
                    queryFn:   () => fetchActiveHours(),
                    staleTime: Infinity,
                    gcTime:    1000 * 60 * 30,//30min
                    retry: false,
                  });
}