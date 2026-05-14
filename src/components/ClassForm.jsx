import DivInput from "./DivInput";
import TimeSelector from "./TimeSelector";
import SelectDay from "./SelectDay";
import useSchool from "../hooks/useSchool";
import { ToastContainer, toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingMessage from "./LoadingMessage";

export default function ClassForm() {

  const { time, classLength, classModal, 
          selStudent, selDay, setModal } = useSchool();

  const { request } = useApi();
  const queryClient = useQueryClient();

  //Async function to send requests to schedule or modify a class.
  const handleClassData = async() => {

    const classId = classModal?.id ?? null;
    const method  = classId ? "PUT" : "POST"; 
    const url     = classId ? `/api/student_classes/${classId}` 
                            : "/api/student_classes";

    //Validate that all data is included
    if(!selStudent?.id ||
        !selDay?.id    ||
        !time?.starts  ||
        !time?.ends
    ){  
        toast.error("Missing required fields.");
        return;
    }

    //Use the states to set the data 
    //which is going to be sent in the request.
    const classData = { student_id : selStudent.id,
                        day_id     : selDay.id,
                        starts     : time.starts,
                        ends       : time.ends, 
                      };

    const message   = classId ? "Class modified."
                              : "Class scheduled.";

    const { success } = await request( method,
                                       url,
                                       classData,
                                       message );
    return success;
  }


  const classMutation = useMutation({
    mutationFn: handleClassData,

    //Get success returned from handleClassData()
    onSuccess:(success) => {
      if(success){
        queryClient.invalidateQueries({queryKey:["classes"]});
        setModal(false);
      }
    },
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    classMutation.mutate();
  }


  return (
    <>
    
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

        <div className="mt-5">
          <button
            type="button"
            onClick={() => console.log(selStudent)}
            className="button-base bg-red-500 hover:bg-red-600"
          >
            Cancel Class
          </button>
          <button 
            type="submit"
            className={`button-base bg-indigo-500 
                      ${classMutation.isPending ? 'bg-indigo-300 hover:cursor-not-allowed' : 'hover:bg-indigo-600'}`}
            disabled={classMutation.isPending}
          >
            {classMutation.isPending ? "Saving Class..." : "Save"}
          </button>
        </div>
      </form>
    </>
  )
}
