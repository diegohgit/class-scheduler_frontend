import { useQuery } from "@tanstack/react-query";
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
                    gcTime: 1000 * 60 * 90//1hr 30min
                  });
}


//Use query function to fetch a single student.
export const useStudent = (id) => {

  return useQuery({ queryKey: ["student", id],
                    queryFn: () => getStudents(id),
                    staleTime: Infinity,
                    gcTime: 1000 * 60 * 90,//1hr 30min
                    retry: false,
                  });
}