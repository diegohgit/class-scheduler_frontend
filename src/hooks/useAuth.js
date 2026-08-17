import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import axiosClient from "../config/axios";


const { request } = useApi();

const getUser = async () => {

  const { success, response } = await request("GET", 
                                              "/api/user");

  if(!success) throw new Error("Failed to login");
  return response?.data;
}



//Get user information.
export const useUser = () => {

  return useQuery({ queryKey:['user'],
                    queryFn: getUser,
                    retry: false,
                  });
}



//Async function to get csrf-cookie
//and send user credentials.
const handleRequest = async({data}) => {

  await axiosClient({method: "GET", url: '/sanctum/csrf-cookie', });

  const { success, response } = await request("POST",
                                              "/api/login/",
                                              data,);

  return {success, response};
}



//Login mutation used to send user credentials.
export const useLoginMutation = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: handleRequest,
      onSuccess: (response) => {
        if(response?.success){

          //Add user information to 'user' queryData.
          queryClient.setQueryData(
             ['user', response?.response?.data],
          );
        }

      options?.onSuccess(response?.success);
    },
  });
}



//Function used to send logout request using axiosClient.
export const handleLogout = async () => {

  const { data } = await axiosClient({method:'POST', url:'/api/logout', });

  const success = data?.success;

  if(!success) throw new Error('Failed to logout');
 
  return success;
}



//Logout mutation.
export const useLogoutMutation = (options = {}) => {

  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: handleLogout,
      onSuccess: (success) => {

        if(success){
          queryClient.removeQueries(
             ['user'],
          );
        }

      options?.onSuccess(success);
    },
  });
}