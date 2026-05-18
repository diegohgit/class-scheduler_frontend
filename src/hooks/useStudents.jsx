import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";

const { request } = useApi();

//Send get request.
const getStudentsRQ = async () => {
  const url = 'api/students/';

  const { success, response } = await request("GET", url)

  if(!success) throw new Error("Failed to fetch students");
  return response.data.data;
}


//Use query function to fetch students.
export const useStudents = () => {

  return useQuery({ queryKey: ["students"],
                    queryFn: getStudentsRQ,
                    staleTime: Infinity,
                    gcTime: 1000 * 60 * 90//1hr 30min
                  })
}