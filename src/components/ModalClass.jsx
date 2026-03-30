import useSchool from "../hooks/useSchool";
import ClassForm from "./ClassForm";
import axiosClient from "../config/axios";

export default function ModalClass() {

  const { handleClickModal } = useSchool();

  //Async function to make a post request and schedule a new class.
  async function handleSubmitClass(data){
    try{
      await axiosClient.post('/api/student_classes', data);
      console.log('class created');
    } catch(error){
      console.log(error);
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