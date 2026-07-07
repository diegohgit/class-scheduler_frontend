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

        //****** POST/PUT ******
          if(method === "POST" || method === "PUT"){

            //Modify class notes info in student list local cache data.
            queryClient.setQueryData(["students"], (old) =>{
              if(!old) return old;

              return [...old].map((stu) => stu.id === resClass.student_id
                    ? { ...stu,
                        class_notes      : resClass.class_notes,
                        class_notes_date : resClass.class_notes_date,}
                    : stu
              );
            });

            //Modify class notes info in local cache data of selected student.
            queryClient.setQueryData(["student", String(resClass.student_id)], (old) => {
              //In case the student doesn't exist in the cache, in won't do anything.
              if(!old) return old;

              return {...old, class_notes      : resClass.class_notes,
                              class_notes_date : resClass.class_notes_date,}
              }
            );

            //If method is POST, add class to list of classes.
            //If method is PUT, replace the old class with the new one.
            const newClasses = method === "POST" 
                             ? [...old, resClass]
                             : old.map((c) => c.id === resClass.id ? resClass : c);

            //Replace old class notes data with the new information
            //in everey class of the selected student.
            return newClasses?.map((c) => c.student_id === resClass.student_id 
                                  ? {...c, class_notes      : resClass.class_notes,
                                           class_notes_date : resClass.class_notes_date}
                                  : c);
          }

        //****** DELETE ******
          if(method === "DELETE"){

            return old.filter((c) => c.id !== resClass.id);
          }
        });
      }
      options?.onSuccess(response?.success);
    }
  });
}