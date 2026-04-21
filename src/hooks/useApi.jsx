import { toast } from "react-toastify";
import axiosClient from "../config/axios";

export const useApi = () => {

  const request = async (method, url, data, msg) =>{
    
    let success  = false;
    let message  = "An error has occurred.";
    let response = null;
    let notification = null;

    //There will be cases where notifications will not be required
    if(msg) notification = toast.loading("Please wait...");

    try{
      response = await axiosClient({method, url, data});
      success = true;

    } catch (error){
      console.log(error)
      message = error.response?.status === 422 ? error.response.data.message 
                                               : "Something went wrong.";

    } finally{

      if(msg){
        toast.update(notification, {
                        render: success ? msg : message,
                        type:   success ? "success" : "error",
                        isLoading: false,
                        autoClose: 3000,
                    });

      }else if(!success) toast.error(message);
    }

    return { success, message, response };
  }

  return { request };
} 