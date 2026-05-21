import { toast } from "react-toastify";
import axiosClient from "../config/axios";

export const useApi = () => {

  const request = async (method, url, data, msg) =>{

    let success  = false;
    let message  = "An error has occurred.";
    let response = null;

    try{
      response = await axiosClient({method, url, data});

      if(method === "POST" || method === "PUT" ){

        //Laravel APIs are configured to send success=true.
        if(response?.data?.success) success = true;
      }
      else if(method === "GET"){
        //Validate if data structure is correct
        //Data may come in either of these two structures:
        const data = response?.data?.data ?? response?.data;

        if(Array.isArray(data)) success = true;
      }

    } catch (error){
      console.log(error)

      message = error.response?.status === 422 ? error.response.data.message
                                               : "Something went wrong.";
      throw error;

    } finally{

      if(success && msg) toast.success(msg)
      else if(!success)  toast.error(message);
    }

    return { success, message, response };
  }
  return { request };
} 