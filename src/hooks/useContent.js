import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks/useApi";


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