import useSchool from "../hooks/useSchool";
import ClassForm from "./ClassForm";
import axiosClient from "../config/axios";

export default function ModalClass() {

  const { handleClickModal } = useSchool();

  //Async function to send requests to schedule or modify a class.
  async function handleSubmitClass(data, method, id){

    try{
      const url = id
                  ? `/api/student_classes/${id}` 
                  : '/api/student_classes';

      await axiosClient({ method: method,
                          url:    url,
                          data:   data
                        });

      const action = method === "POST" ? "scheduled." : "modified.";
      return { success: true, message: "Class "+action }

      } catch (error){
        if(error.response?.status === 422){
          return { success: false, message: error.response.data.message };
  
        }else return { success: false, message: "An error has occurred" };
      }
    }


  return (
    <>
      <div className="flex mb-5">
        <h2 className="w-11/12 text-2xl font-bold">Class Information</h2>
        <div className="flex justify-end">
          <button
            className="hover:cursor-pointer"
            onClick={handleClickModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
              viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <ClassForm onSubmit = {handleSubmitClass}/>
    </>
  )
}