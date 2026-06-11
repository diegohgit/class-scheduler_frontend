import DivInput from "./DivInput";
import TimeSelector from "./TimeSelector";
import SelectDay from "./SelectDay";
import useSchool from "../hooks/useSchool";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useClassMutation } from "../hooks/useClasses";
import { useState } from "react";

export default function ModalClass() {

  const { time, classLength, classModal, 
          selStudent, selDay, setModal,
          handleClickModal } = useSchool();

  const [ showConfirm, setShowConfirm ] = useState(false);
  //State usefull to show a loading message ONLY when a class is being deleted.
  const [ isDeleting, setIsDeleting ] = useState(false);

  const queryClient = useQueryClient();



  const classMutation = useClassMutation({
    onSuccess:() => {
        setModal(false);
    },
  })



  //Validate data and run classMutation.
  const handleSubmit = (e) => {
    e.preventDefault();

    //Validate that all data is included
    if(!selStudent?.id ||
       !selDay?.id     ||
       !time?.starts   ||
       !time?.ends
    ){  
      toast.error("Missing required fields.");
      return;}

    const classId = classModal?.id ?? null;
    const method  = classId ? "PUT" : "POST"; 

    //Use the states to set the data 
    //which is going to be sent in the request.
    const data = {id         : classId, 
                  student_id : selStudent.id,
                  day_id     : selDay.id,
                  starts     : time.starts,
                  ends       : time.ends, };

    classMutation.mutate({data, method});
  }



  return (
    <>
      <div className="flex m-4">
        <h2 className="text-center w-full text-2xl font-bold">Class Information</h2>
        <div className="flex justify-end">
          <button
            className="hover:cursor-pointer"
            onClick={handleClickModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
              viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <form className="w-90 h-60 mx-auto"
            onSubmit={handleSubmit}>
        <div className="w-85 mx-auto" >
          <div className="h-15">
            <b>Student:</b>
            <DivInput info = {selStudent} />
          </div>
          <div className="flex mt-2">
            <b className="mr-2">Day:</b>
            <SelectDay />
          </div>
          <div className="h-10 mt-4 flex">
            <div className="w-5/12 flex">
              <b className="mr-2">Starts:</b>
              <TimeSelector
                initialTime={time.starts}
                auxiliar = "start"
              />
            </div>
            <div className="w-5/12 flex">
              <b className="ml-8 mr-2">Ends:</b>
              <TimeSelector
                initialTime={time.ends}
                auxiliar = "end"
              />
            </div>
          </div>
          <div className="flex">
            <b className="mr-2">Duration: </b>
            <p className="mr-1">{classLength}</p>
          </div>
        </div>

        <div className="mt-5 justify-center flex">
          {/* DELETE CLASS BUTTON */}
            {classModal?.id && (
              <div className="w-6/12 flex justify-center items-center text-center">

                {showConfirm === false ? (
                  <button type="button"
                          onClick={() => {setShowConfirm(true); 
                                          setIsDeleting(true);}}
                          className="button-base bg-red-500 hover:bg-red-600 "
                  >
                    Delete Class
                  </button>

                ) : (
                  isDeleting === true && (
                    classMutation.isPending ? 
                    ( <span>Deleting class...</span>
                    ):(
                      <div>
                        <span>Delete class?</span>

                        <div className="*:m-1 *:font-bold *:hover:underline
                                        *:hover:cursor-pointer"
                        >
                          <span onClick={() => setShowConfirm(false)}
                          >No</span>

                          <span onClick={() => {classMutation.mutate({data:{id: classModal.id}, 
                                                                      method: "DELETE"});
                                                }}
                          >Yes</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
              )
            }

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            className={`button-base bg-indigo-500 
                      ${classMutation.isPending ? 'bg-indigo-300 hover:cursor-not-allowed' : 'hover:bg-indigo-600'}`}
            disabled={classMutation.isPending}
          >
            {classMutation.isPending && !isDeleting ? "Saving Class..." : "Save"}
          </button>
        </div>
      </form>
    </>
  )
}