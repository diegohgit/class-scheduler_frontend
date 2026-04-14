import DivInput from "./DivInput";
import TimeSelector from "./TimeSelector";
import SelectDay from "./SelectDay";
import useSchool from "../hooks/useSchool";
import { ToastContainer, toast } from "react-toastify";

export default function ClassForm({ onSubmit }) {

  const { time, classLength, classModal, selStudent,
          selDay, setModal, fetchClasses } = useSchool();

  const handleSubmit = async(e) => {
    e.preventDefault();

    const notification = toast.loading("Please wait...")

    const method = classModal?.id ? "PUT" : "POST"; 

    //Use the states to set the data 
    //wich is going to be sent in the post request.
    const classData = { id         : classModal?.id || null,
                        student_id : selStudent.id,
                        day_id     : selDay.id,
                        starts     : time.starts,
                        ends       : time.ends, 
                    };

    const { success , message } = await onSubmit( classData, method, classModal?.id );

    if(success){
      setModal(false);

      fetchClasses();
    }

    //Hide the loading notification and show the result message.
    toast.update(notification, {  render: message, 
                                  type: success ? "success" : "error", 
                                  isLoading: false,
                                  autoClose: 3000,
                                });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="h-15">
          <b>Student:</b>
          <DivInput info = {selStudent} />
        </div>
        <div className="flex mt-2">
          <b className="mr-2">Day:</b> 
          <SelectDay />
        </div>
        <div className="h-10 mt-3 flex">
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

        <div>
          <button
            type="button"
            onClick={() => console.log(selStudent)}
            className="button-base bg-red-500 hover:bg-red-600"
          >
            Cancel Class
          </button>
          <button 
            type="submit"
            className="button-base bg-indigo-500 hover:bg-indigo-600"
          >
            Ok
          </button>
        </div>
      </form>
    </>
  )
}
