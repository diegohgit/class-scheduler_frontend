import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApi } from "./useApi";

const { request } = useApi();

//Send get request.
const getStudents = async (id) => {
  const url = id ? `/api/students/${id}` : '/api/students/';

  const { success, response,  } = await request("GET", url);

  if(!success) throw new Error("Failed to fetch students");
  return response.data;
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



//Async function to send student mutation requests.
const handleRequest = async({data, method}) => {

  const id = data.id ?? null;

  const url  = id ? `api/students/${id}` : `/api/students`;
  let action = "";

       if(method === "POST")   action = "created";
  else if(method === "PATCH")  action = "updated";
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
    onSuccess: async (response) =>{

      if (!response?.success) return;

      const resStudent = response?.response?.data;
      const method     = response?.method;

      if (!resStudent) return;

      //****** POST ******
      if(method === "POST"){

        queryClient.setQueryData(["students"], (old) => {
            if (!Array.isArray(old)) return old;

            return [...old, resStudent].sort();
        });

      //****** PATCH ******
      }else if(method === "PATCH"){

        //Modify student local cache data.
        queryClient.setQueryData(
          ["student", String(resStudent.id)], (old) => {
            if(!old) return old;

            return resStudent;
        });

        //Modify student's info on its classes.
        queryClient.setQueryData(["classes"], (old) => {
          if (!Array.isArray(old)) return old;

          return old?.map((c) => 
            c.student_id === resStudent.id
              ? {...c,  student_id  : resStudent.id,
                        first_name  : resStudent.first_name,
                        last_name   : resStudent.last_name,
                        color       : resStudent.color.name,
                        class_notes : resStudent.class_notes,
                        class_notes_date : resStudent.class_notes_date}
              : c);
        });

        //Update list.
        queryClient.setQueryData(["students"], (old) => {
          if (!Array.isArray(old)) return old;

          return [...old].map((stu) => 
            stu.id === resStudent.id 
              ? {...stu,
                  id          : resStudent.id,
                  first_name  : resStudent.first_name,
                  last_name   : resStudent.last_name,
                  level       : resStudent.level.name,
                  class_notes : resStudent.class_notes,
                  class_notes_date : resStudent.class_notes_date,
                }
              : stu
          ).sort();
          //.sort((a, b) => a.first_name.localeCompare(b.first_name)
          //                || (a.last_name ?? '').localeCompare(b.last_name ?? ''));
        });

      //****** DELETE ******
      }else if(method === "DELETE"){

        //Remove classes that belong to the deleted student.
        queryClient.setQueryData(["classes"], (oldClass) => {
          if (!Array.isArray(oldClass)) return oldClass;

          return oldClass.filter(
            (oc) => oc.student_id !== resStudent.id
          );
        });

        //Remove student from local cache data list.
        queryClient.setQueryData(["students"], (old) => {
          if (!Array.isArray(old)) return old;

          return old.filter(
            (stud) => stud.id !== resStudent.id
          );
        });
      }
      
      options?.onSuccess(response?.success);
    }
  });
}