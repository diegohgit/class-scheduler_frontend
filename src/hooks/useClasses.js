import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";



const { request } = useApi();

const fetchClasses = async () => {

  const { success, response } = await request("GET", 
                                              "api/student_classes/",);

  if(!success) throw new Error("Failed to fetch clases");
  return response.data;
}



//Use query function to fetch scheduled classes.
export const useClasses = () => {

  return useQuery({ queryKey:  ["classes"],
                    queryFn:   fetchClasses,
                      staleTime: Infinity,
                      gcTime:    1000 * 60 * 90,//1hr 30min
                      retry: false,
                    });
}



//Async function to send chapter/section mutation requests.
const handleRequest = async({data, method}) => {

  const id   = data?.id ?? null;
  const url  = id ? `api/student_classes/${id}` : `/api/student_classes`;
  let action = "";

       if(method === "POST")   action = "created";
  else if(method === "PUT")    action = "updated";
  else if(method === "DELETE") action = "deleted";

  const { success, response } = await request(method,
                                              url,
                                              data,
                                              `Class ${action}.`);
  return {success,
          response,
          method};
}



export const useClassMutation = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleRequest,
    onSuccess: (response) => {
      if(response?.success){
        const resClass = response?.response?.data;
        const method   = response?.method;

        queryClient.setQueryData(["classes"], (old) => {
          //Prevent errors when the cache doesn't contain any data yet.
          if(!old) return old;

          //****** POST ******
          if(method === "POST"){

            return [...old, resClass];

          //****** PUT ******
          }else if(method === "PUT"){
            
            return old.map((c) => c.id === resClass.id ? resClass : c);

          //****** DELETE ******
          }else if(method === "DELETE"){

            return old.filter((c) => c.id !== resClass.id);
          }

        });
      }
      options?.onSuccess(response?.success);
    }
  });
}