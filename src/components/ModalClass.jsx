import StudentSelector from "./StudentSelector";
import TimeSelector from "./TimeSelector";
import useSchool from "../hooks/useSchool";
import { toast } from "react-toastify";
import { useClasses, useClassMutation } from "../hooks/useClasses";
import { useEffect, useState } from "react";
import { days } from "../data/days";
import { useActiveHours } from "../hooks/useActiveHours";

export default function ModalClass() {

  const { time, classLength, selStudent,
          selDay, setModal, handleClickModal,
          classModal, setClassModal, expanded,
          setExpanded, getFormattedDate, getDuration} = useSchool();

  //State to define if the delete confirmation options will be shown.
  const [ showConfirm, setShowConfirm ] = useState(false);
  //State usefull to show a loading message ONLY when a class is being deleted.
  const [ isDeleting, setIsDeleting ] = useState(false);



  //Get active hours using useActiveHours()
  const { data:active_hours = {}, } = useActiveHours();

  //Get scheduled classes using useClasses()
  const { data:classes = [], } = useClasses();



  //Check if there's another class with same time range and same student.
  const matchFound = () => classes?.find(cls => {
                return (
                  cls.starts === time.starts &&
                  cls.ends   === time.ends   &&
                  cls.student_id === selStudent.id
                );
  });



  //blockSearch is used to prevent the system from doing day searches (matchFound)
  //every time the user changes time range or student. This is useful to update 
  //time range or student of a class without losing the current classModal.
  const [blockSearch, setBlockSearch] = useState(false);
  //State used to store list of days of a class.
  const [selectedDays, setSelectedDays] = useState([]);
  //States used to compare if the initial student or class were changed.
  const [initStudentId, setInitStudentId] = useState(selStudent?.id ?? null);
  const [ initClass, setInitClass ]       = useState(classModal ?? null);
  //State used to store the class_id that will be deleted in case of merging.
  const [deleteClassId, setDeleteClassId] = useState(null);

  //Handle changes of student and time range in modalClass.
  useEffect(() => {

    //If time range is invalid or there's no selStudent 
    //just mark the current day and don't do anything else.
    if(!validTime(time) || !selStudent?.id){ 
      if(!selectedDays.length) setSelectedDays([selDay?.id]);
      return;
    }

    let daysSource = [];

    const classFound = matchFound();

    if(blockSearch && selStudent?.id === initStudentId)
    {
      //If user selects a class and then finds another class of the same student, 
      //merge both classes.  
      if(classFound && classFound?.id !== initClass?.id)
      {
        //Merge days of classFound and initClass.
        daysSource = [...(classFound.days ?? []),
                      ...(initClass?.days ?? []) ];
        setDeleteClassId(initClass?.id);
      }
      else return;//If user is changing time range using the same student,
                  //don't do anything because it would lose the current classModal.
    }

    if(!daysSource.length){
      //If there isn't a classFound but a classModal was already loaded in the modal,
      //keep using it to change only student.
      //If there isn't neither classFound nor classModal, use the selDay.id.
      daysSource = classFound?.id ? (classFound.days ?? [])
                                  : classModal?.id ? (classModal.days ?? []) : [{id : selDay?.id}];
    }

    setSelectedDays( daysSource?.map(day => day.id) );

    if(classFound){
      setClassModal(classFound);
      setInitStudentId(selStudent?.id);
      setInitClass(classFound);
      setBlockSearch(true);
    }
  }, [selStudent, time,]);



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
        setExpanded(false);
        handleClickModal();
    },
  })



  //Validate time range.
  const validTime = (time, notification) => {

    //Validate that the class doesn't last longer than 3hrs.
    if(getDuration(time).asHours() > 3 ){

      if(notification) toast.error("Classes can't last longer than 3 hours.");
      return false;
    }

    //Validate that the class doesn't last less than 15min.
    if(getDuration(time).asMinutes() < 15 ){

      if(notification) toast.error("Classes can't last less than 15 minutes.");
      return false;
    }

    return true;
  }



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

    if(!validTime(time, true)) return false;

    //Validate that the selected time range doesn't overlapse with another class.
    const findOverlapse = classes?.some(cls => {
      //Validate that the selected time range doesn't overlapse with another class.
      const checkTime = cls.starts < time.ends && cls.ends > time.starts;
      //If the class has different class_id
      //it won't be possible to schedule the class
      //unless it's scheduled on a different day.
      //const checkStudent = cls.student_id !== selStudent.id;
      const checkClass = cls.id !== classModal?.id;

      if(checkTime && checkClass){
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

    const until = active_hours.until === '00:00' ? '24:00' : active_hours.until;
    //Validate that the selected time range is inside the ActiveHours range.
    if(time.starts < active_hours.from || time.ends > until){
      toast.error("This time range is outside the active hours.");
      return false;
    }

    return true;
  }



  //Set initialClassNotes to validate if it should be send in the POST/PUT request.
  const [initialClassNotes, setInitialClassNotes] = useState(undefined);
  //State useful to handle class notes textarea value.
  const [classNotes, setClassNotes] = useState("");
  //State used to store the result of getLastEntry().
  const [classNotesDate, setClassNotesDate] = useState("");

  //If theres a student loaded in the modal,
  //load its class notes into the textarea and initialize initialClassNotes.
  useEffect(() => {

    setClassNotes(selStudent.class_notes ?? '');
    setInitialClassNotes(selStudent.class_notes ?? undefined);

    const notesDate = selStudent.class_notes_date ? getFormattedDate(selStudent.class_notes_date) : ''
    setClassNotesDate(notesDate);

  }, [selStudent]);



  //Run classMutation.
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if(!validation(formData)) return;

    const classId = classModal?.id ?? null;
    const method  = classId ? "PUT" : "POST";

    //If user didn't modified class_notes, send it as undefined.
    const sendClassNotes = initialClassNotes !== formData.get("class_notes") 
                           ? formData.get("class_notes") : undefined;

    //Use the states to set the data
    //which is going to be sent in the request.
    const data = {id          : classId,
                  student_id  : selStudent.id,
                  days_ids    : selectedDays,
                  starts      : time.starts+':00',
                  ends        : time.ends+':00',
                  class_notes : sendClassNotes,
                  delete_id   : deleteClassId,
                };

    classMutation.mutate({data, method});
  }



  return (
    <>
      <div className="flex m-4">
        <h2 className="text-center w-full text-2xl font-bold">Class Information</h2>
        <div className="flex justify-end">
          <button
            className="hover:cursor-pointer"
            onClick={() => {handleClickModal(), setExpanded(false)}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
              viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <form className="w-90 mx-auto"
            onSubmit={handleSubmit}>
        <div className="w-85 mx-auto">
          <div className="h-15">
            <b>Student:</b>
            <StudentSelector/>
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
                auxiliary = "start"
              />
            </div>
            <div className="w-5/12 flex">
              <b className="ml-8 mr-2">Ends:</b>
              <TimeSelector
                initialTime={time.ends}
                auxiliary = "end"
              />
            </div>
          </div>
          <div className="flex">
            <b className="mr-2">Duration: </b>
            <p className="mr-1">{classLength}</p>
          </div>

          <div>
            <div className="inline-flex mt-4 cursor-pointer
                             items-center"
                  onClick={() => setExpanded(!expanded)}>
              <b className="mr-2">Class notes</b>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                className={`size-6 transition-all duration-300
                            mt-1
                            ${expanded ? "rotate-180" : "rotate-0"}`} >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              { classNotesDate &&
                  <span className="italic ml-3 text-gray-600">Last entry: {classNotesDate}</span>
              }
            </div>

            <div className={`overflow-hidden transition-all duration-300
                            ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity"}`}>
              <textarea className=" textarea-base resize-none h-15!
                                    mb-1! w-11/12! mx-auto
                                    block"
                        name = "class_notes"
                        value = {classNotes ?? undefined}
                        onChange = {(e) => setClassNotes(e.target.value)}/>
            </div>
          </div>
        </div>



        <div className=" justify-center flex">
          {/* DELETE CLASS BUTTON */}
            {classModal?.id && (
              <div className="w-6/12 flex justify-center 
                              items-center text-center">

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