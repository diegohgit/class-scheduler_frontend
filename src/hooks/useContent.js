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



//Async function to send requests to create/update/delete a section.
const handleRequest = async({sectionData, method}) => {

  const id = sectionData?.section_id ?? null;

  const url     = id ? `api/sections/${id}` : "/api/sections";
  const message = id ? "Section updated." : "Section created.";

  const { success } = await request(method,
                                    url,
                                    sectionData,
                                    message );
  return success
}


//Mutation to create/update sections.
const queryClient = useQueryClient();

export const useSectionMutation = useMutation({
  mutationFn: handleRequest,
  onSuccess: async (success) =>{
    if(success){
      await queryClient.refetchQueries({queryKey:["chapters"]})
    }
  }
});


