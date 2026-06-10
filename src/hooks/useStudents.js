import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApi } from "./useApi";

const { request } = useApi();

//Send get request.
const getStudents = async (id) => {
  const url = id ? `/api/students/${id}` : '/api/students/';

  const { success, response,  } = await request("GET", url);

  if(!success) throw new Error("Failed to fetch students");
  return response.data.data;
}


//Use query function to fetch students.
export const useStudents = () => {

  return useQuery({ queryKey: ["students"],
                    queryFn: () => getStudents(),
                    staleTime: Infinity,
                    gcTime: 1000 * 60 * 90,//1hr 30min
                    retry: false,
                  });
}


//Use query function to fetch a single student.
export const useStudent = (id) => {

  return useQuery({ queryKey: ["student", id],
                    queryFn: () => getStudents(id),
                    staleTime: Infinity,
                    //gcTime: default time is 5min.
                    retry: false,
                  });
}



//Async function to send chapter/section mutation requests.
const handleRequest = async({data, method}) => {

  const id   = data?.id ?? null;
  const url  = id ? `api/students/${id}` : `/api/students`;
  let action = "";

       if(method === "POST")   action = "created";
  else if(method === "PUT")    action = "updated";
  else if(method === "DELETE") action = "deleted";

  const { success, response } = await request(method,
                                              url,
                                              data,
                                              `Student ${action}.`);
  return {success,
          response,
          method};
}



//STUDENT'S MUTATION



//Mutation to create/update/delete students.
export const useStudentMutation = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleRequest,
    onSuccess: (response) =>{

      if(response?.success){
        const resStudent = response?.response?.data;
        const method     = response?.method;

        queryClient.setQueryData(["students"], (old) => {          
          //Prevent errors when the cache doesn't contain any data yet.
          if(!old) return old;

          //****** POST ******
          if(method === "POST"){

            return [...old, resStudent].sort();

          //****** PUT ******
          }else if(method === "PUT"){

            //Modify student local cache data.
            queryClient.setQueryData(["student", String(resStudent.id)], resStudent);

            //Update list.
            return [...old].map((stu) => stu.id === resStudent.id 
                                    ? {...stu,
                                       id:    resStudent.id,
                                       name:  resStudent.name,
                                       level: resStudent.level.name,
                                      }
                                    : stu
                            ).sort((a, b) => a.name.localeCompare(b.name));

          //****** DELETE ******
          }else if(method === "DELETE"){

            //Remove student local cache data .
            queryClient.removeQueries({queryKey: ["student", String(resStudent.id)]});

            //Remove classes that belong to the deleted student.
            queryClient.setQueryData(["classes"], (oldClass) => {
              return oldClass.filter((oc) => oc.student_id !== resStudent.id)});

            //Remove student from local cache data list.
            return old.filter((stud) => stud.id !== resStudent.id);
          }

          return old;
        });
      }
      options?.onSuccess(response?.success);
    }
  });
}

