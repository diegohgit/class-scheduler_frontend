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

  const { success, response } = await request(method,
                                    url,
                                    sectionData,
                                    `Section ${action}.`);
  return {"success"  : success,
          "response" : response,
          "method"   : method};
}



//Mutation to create/update/delete sections.
export const useSectionMutation = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleRequest,
    onSuccess: (response) =>{

      if(response?.success){
        const resSection = response?.response?.data;

        queryClient.setQueryData(["chapters"], (old) => {
          //Prevent errors when the cache doesn't contain any data yet
          if(!old) return old;

          return old.map((chapter) => {

          //****** POST ******
              if(response.method === "POST"){

                if(chapter.id === Number(resSection.chapter_id)){

                  //Concatenate new section to list of sections.
                  return {...chapter,
                          section: [ ...chapter.section, resSection]
                          //order alphabetically
                          .sort((a, b) => a.name.localeCompare(b.name, undefined, {
                                                                    numeric: true,
                                                                    sensitivity: "base"
                                                                  }
                                              ))
                  };
                }

          //****** PUT ******
              }else if(response.method === "PUT"){

                const oldChapter = resSection.old_chapter;

                //Remove section from old chapter.
                if(oldChapter && chapter.id === oldChapter ){

                  return {...chapter, 
                          section: chapter.section.filter((sec) => sec.id !== resSection.section.id)
                  };
                }

                if(chapter.id === Number(resSection.section.chapter_id)){
                  const exists = chapter.section.some(sec => sec.id === resSection.section.id);

                  //If section exists in current chapter, run a .map() to all sections
                  //when it match the updated section, return it.
                  //If section doesn't exist, just concatenate it to the list of sections.
                  return {...chapter,
                          section: exists ? chapter.section.map(sec => 
                                              sec.id === resSection.section.id 
                                                ? resSection.section
                                                : sec)
                                          : [...chapter.section, resSection.section]
                                            //order alphabetically
                                            .sort((a, b) => 
                                              a.name.localeCompare(b.name, undefined, {
                                                                    numeric: true,
                                                                    sensitivity: "base"
                                                                  }
                                              ))
                  };
                }

          //****** DELETE ******
              }else if(response.method === "DELETE"){

                if (chapter.id === Number(resSection.chapter_id)) {
                  //Remove section from list of sections.
                  return {...chapter,
                          section: chapter.section.filter((sec) => sec.id !== resSection.id)
                  }
                }
              }

            return chapter;
          })
        });
      }
      options?.onSuccess(response.success);
    }
  });
}

