import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApi } from "../hooks/useApi";
import useSchool from "./useSchool";

const { request } = useApi();
//Send get request.
const fetchChapters = async (id) => {
  const url = id ? `api/students/${id}/progress`
                  : "api/chapters/";

  const { response } = await request("GET", url, );
  if(response?.data) return response.data
}



//Fetch all chapters.
export const useContent = () => {
  return useQuery({ queryKey:  ["chapters"],
                    queryFn:   () => fetchChapters(),
                    staleTime: Infinity,
                    gcTime:    1000 * 60 * 30,//30min
                    retry: false,
                  });
}



//Fetch only chapters seen by a single student.
export const useStudentProgress = (id) => {
  return useQuery({ queryKey:  ["studentProgress", id],
                    queryFn:   () => fetchChapters(id),
                    staleTime: Infinity,
                    //gcTime: default time is 5min.
                    retry: false,
                  });
}



//MUTATION



//Async function to send useSectionMutation requests.
const handleRequest = async({sectionData, method}) => {

  const id   = sectionData?.section_id ?? null;
  const url  = id ? `api/sections/${id}` : "/api/sections";
  let action = "";

       if(method === "POST")   action = "created";
  else if(method === "PUT")    action = "updated";
  else if(method === "DELETE") action = "deleted";

  const { success } = await request(method,
                                    url,
                                    sectionData,
                                    `Section ${action}.`);
  return success;
}



//Mutation to create/update/delete sections.
export const useSectionMutation = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleRequest,
    onSuccess: async (success) =>{
      if(success){
        await queryClient.refetchQueries({queryKey:["chapters"]})
      }

      //options contains the callback defined when 
      //useSectionMutation() is called in other components.
      options.onSuccess();
    }
  });
}

