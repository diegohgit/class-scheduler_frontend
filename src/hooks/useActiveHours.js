import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApi } from "../hooks/useApi";


const { request } = useApi();
//Send get request.
const fetchActiveHours = async () => {

  const { response } = await request("GET", 'api/active_hours/', );

  if(response?.data) return response.data;
}



//Fetch active hours
export const useActiveHours = () => {
  return useQuery({ queryKey:  ["active_hours"],
                    queryFn:   () => fetchActiveHours(),
                    staleTime: Infinity,
                    gcTime:    1000 * 60 * 30,//30min
                    retry: false,
                  });
}



//Async function to send active_hours mutation requests.
const handleMyRequest = async(data) => {

  const { success, response } = await request('PUT',
                                              'api/active_hours/1',
                                              data,
                                              'Active hours updated.');
  return {success, response};
}



//Mutation to create/update/delete students.
export const useActiveHrsMutation = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleMyRequest,
    onSuccess: (response) =>{
      if(response?.success){
        queryClient.invalidateQueries({ queryKey: ['active_hours'] });
      }

      options?.onSuccess(response?.success);
    }
  });
}