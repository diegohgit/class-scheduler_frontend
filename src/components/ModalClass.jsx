import DivInput from "./DivInput";
import TimeSelector from "./TimeSelector";
import useSchool from "../hooks/useSchool";
import { toast } from "react-toastify";
import { useClasses, useClassMutation } from "../hooks/useClasses";
import { useEffect, useState } from "react";
import { days } from "../data/days";

export default function ModalClass() {

  const { time, classLength, selStudent,
          selDay, setModal, handleClickModal,
          classModal, } = useSchool();

  //State to define if the delete confirmation options will be shown.
  const [ showConfirm, setShowConfirm ] = useState(false);
  //State usefull to show a loading message ONLY when a class is being deleted.
  const [ isDeleting, setIsDeleting ] = useState(false);



  //Get scheduled classes using useClasses()
  const { data:classes = [], } = useClasses();



  //Find in the same time range other class of the same student.
  const matchSchedule = classes?.find(cls => {
                return (
                   cls.starts === time.starts &&
                   cls.ends   === time.ends   &&
                   cls.student_id === selStudent.id
                );
  });



  //blockSearch is used to prevent the system of doing day searches (matchSchedule)
  //every time the user changes time range or student.
  const [blockSearch, setBlockSearch]   = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  //If theres no class loaded in the current modal, check only the current day.
  //Load all days of a class into selectedDays to show them in the checkboxes.
  useEffect(() => {

    if(!classModal){
      setSelectedDays([selDay.id]);
      return;
    }

    if(blockSearch === false){

      //Store every day id from the match class scheduled into dayIds.0
      const dayIds =  matchSchedule?.days?.map(day => day.id) ?? [];

      //new Set() is to avoid duplicated items.
      setSelectedDays([...new Set([...dayIds, selDay.id])]);

      if(classModal) setBlockSearch(true);
    }
  }, [matchSchedule, classModal, blockSearch]);



  //Function used to update selectedDays state.
  const handleDayChange = (e) => {
    const dayId = Number(e.target.value);
    const isChecked = e.target.checked;

    setSelectedDays(prev => isChecked ? [...prev, dayId]
                                      : prev.filter(id => id !== dayId)
    );
  };



  const classMutation = useClassMutation({
    onSuccess:() => {
        setModal(false);
    },
  })



  //Validate data and overlapses.
  const validation = (formData) => {

    const selectedDays = formData.getAll('checked_days');

    //Validate that all data is included
    if(!selStudent?.id ||
       !selDay?.id     ||
       !time?.starts   ||
       !time?.ends     ||
       !selectedDays.length)
    {
      toast.error("Missing required fields.");
      return false;
    }  

    //Validate that student doesn't have a class in the selected time.
    if(matchSchedule?.student_id === selStudent?.id
       && matchSchedule?.id !== classModal?.id)
    {
      toast.error("This student already has scheduled classes in this time range.");
      return false;
    }

    //Validate that the selected time range doesn't overlapse with another class.
    const findOverlapse = classes?.some(cls => {
      const checkTime    = cls.starts < time.ends && cls.ends > time.starts;
      const checkStudent = cls.student_id !== selStudent.id;

      if(checkTime && checkStudent){
        //Validate days.
        const checkDay = cls.days?.some(d =>{

          return selectedDays?.some(selD =>{
              return Number(d.id) === Number(selD)
            }
          )}
        )

        if(checkDay) return true;
      }
      return false;
    });


    if (findOverlapse) {
      toast.error("This time range overlaps with an existing class.");
      return false;
    }

    return true;
  }



  //Run classMutation.
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if(!validation(formData)) return;

    const classId = classModal?.id ?? null;
    const method  = classId ? "PUT" : "POST"; 

    //Use the states to set the data 
    //which is going to be sent in the request.
    const data = {id         : classId, 
                  student_id : selStudent.id,
                  days_ids   : selectedDays,
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
        <div className="w-85 mx-auto">
          <div className="h-15">
            <b>Student:</b>
            <DivInput info = {selStudent}/>
          </div>
          <div className="mt-2">
            <b className="mr-2">Days:</b>
              <div className="flex gap-2.5">
                {
                  days.map((day) => (

                    <div key={day.id}
                         className="w-10 inline-block text-center
                                    *:w-full *:block *:cursor-pointer"
                    >
                      <label htmlFor={day.id}>{day.label.slice(0, 3)}</label>

                      <input id={day.id}
                             type  = "checkbox"
                             name  = "checked_days"
                             value = {day.id}
                             checked  = {selectedDays.includes(day.id)}
                             onChange = {handleDayChange}
                             />
                    </div>
                  ))
                }
              </div>
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