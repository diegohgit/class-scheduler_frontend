import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApi } from "../hooks/useApi";
import useSchool from "./useSchool";



const useContent = () => {

  const { alphabetical } = useSchool();
  const { request } = useApi();



  //Send get request.
  const fetchChapters = async (id) => {
    const url = id ? `api/students/${id}/progress`
                    : "api/chapters/";

    const { response } = await request("GET", url, );

    if(response?.data) 
    {
      //Return student's progress.
      if(id) return response.data;

      //Merge chapters and its sections.
      return [...response.data].sort(alphabetical)
                              .map((chapter) => ({
                                ...chapter,
                                section: [...chapter.section].sort(alphabetical)
                              }));
    }
  }



  //Fetch all chapters.
  const useChapters = () => {
    return useQuery({ queryKey:  ["chapters"],
                      queryFn:   () => fetchChapters(),
                      staleTime: Infinity,
                      gcTime:    1000 * 60 * 30,//30min
                      retry: false,
                    });
  }



  //Fetch only chapters seen by a single student.
  const useStudentProgress = (id) => {
    return useQuery({ queryKey:  ["studentProgress", id],
                      queryFn:   () => fetchChapters(id),
                      staleTime: Infinity,
                      //gcTime: default time is 5min.
                      retry: false,
                    });
  }



  //Async function to send chapter/section mutation requests.
  const handleRequest = async({table, data, method}) => {

    const id   = data?.id ?? null;
    const url  = id ? `api/${table}/${id}` : `/api/${table}`;
    let action = "";

        if(method === "POST")   action = "created";
    else if(method === "PUT")    action = "updated";
    else if(method === "DELETE") action = "deleted";

    const message = table === "chapters" ? "Chapter" : "Section";

    const { success, response } = await request(method,
                                                url,
                                                data,
                                                `${message} ${action}.`);
    return {success,
            response,
            method};
  }



  //CHAPTER'S MUTATION



  //Mutation to create/update/delete CHAPTERS.
  const useChapterMutation = (options = {}) => {

    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: handleRequest,
      onSuccess: (response) =>{

        if(response?.success){

          const resChapter = response?.response?.data;

          queryClient.setQueryData(["chapters"], (old) => {          
            //Prevent errors when the cache doesn't contain any data yet.
            if(!old) return old;

        //****** POST ******
            if(response.method === "POST"){

              const postChapter = resChapter?.data || [];

              //Add the section array so user can add new sections.
              const formatChapter = postChapter.map((chapter) =>{
                                      return {...chapter, section:[]}
                                    });

              const newChapters = [...old, ...formatChapter];

              return newChapters.sort(alphabetical);
        //****** PUT ******
            }else if(response.method === "PUT"){

              return old.map((chapter) => chapter.id === resChapter.id 
                                          ? {...chapter, name: resChapter.name}
                                          : chapter);
        //****** DELETE ******
            }else if(response.method === "DELETE"){

              return old.filter((chap) => chap.id !== resChapter.id);
            }
            return old;
          });
        }
        options?.onSuccess(response?.success);
      }
    });
  }



  //SECTION'S MUTATION



  //Mutation to create/update/delete sections.
  const useSectionMutation = (options = {}) => {

    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: handleRequest,
      onSuccess: (response) =>{

        if(response?.success){
          const resSection = response?.response?.data;

          queryClient.setQueryData(["chapters"], (old) => {
            //Prevent errors when the cache doesn't contain any data yet.
            if(!old) return old;

            return old.map((chapter) => {

            //****** POST ******
                if(response.method === "POST"){

                  const postSection = resSection?.data;

                  if(chapter.id === Number(postSection[0].chapter_id)){

                    //Concatenate new section to list of sections.
                    return {...chapter,
                            section: [ ...chapter.section, ...postSection]
                            .sort(alphabetical)
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
                    //when it matches the updated section, return it.
                    //If section doesn't exist, just concatenate it to the list of sections.
                    return {...chapter,
                            section: exists ? chapter.section.map(sec => 
                                                sec.id === resSection.section.id 
                                                  ? resSection.section
                                                  : sec)
                                              .sort(alphabetical)
                                            : [...chapter.section, resSection.section]
                                              .sort(alphabetical)
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
        options?.onSuccess(response?.success);
      }
    });
  }


  return {
    useChapters,
    useStudentProgress,
    useChapterMutation,
    useSectionMutation,
  }
}

export default useContent;