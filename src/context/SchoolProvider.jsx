import { createContext, useState, useEffect } from "react"
import { useBlocker } from "react-router-dom";
import axiosClient from "../config/axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

const SchoolContext = createContext();
const customStyles = {
    content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    },
  };

const SchoolProvider = ({children}) => {

  //States to store student, day and time selected to schedule a class.
  const [ selStudent, setSelStudent ] 	= useState([]);
  const [ selDay, setSelDay ] = useState([]);
  const [ time, setTime]      = useState([]);

  //State to show/hide the modal.
  const [ modal, setModal ] = useState(0);

  //Function to show/hide the modal.
  const handleClickModal = () => {
    setModal(!modal)
  }
  
  //State to store the class to be shown in the modal.
  const [ classModal, setClassModal ] = useState(0);
  //Function to set the class to be shown in the modal.
  const handleClassModal = (classModal) => {
    setClassModal(classModal)

    if(classModal)setSelStudent({id: classModal.student_id, name: classModal.student});
    else setSelStudent([]);
  }

  //Function to set the time parameters to be displayed on the modal.
  const handleSetTime = ({day, currTime, emptyClassEnd, match}) => {

    setSelDay(day);

    if(!match){
      //Get the hour part from currTime to calculate nextHour
      const currHour = currTime.split(':')[0];
      const nextHour = parseInt(currHour) + 1;
      
      const formatCurrHr = currHour.toString().padStart(2, '0');
      const formatNextHr = nextHour.toString().padStart(2, '0');

      /*  If emptyClassEnd has value, is because there is a class 
          in the current hour, so 'ends' will be the start of the next class.
          Else emptyClassEnd has no value is because there's no class
          in the current hour block, so 'ends' will be the nextHour + ':00'.
      */
      const ends = emptyClassEnd ? formatCurrHr + ':' +emptyClassEnd 
                                  :formatNextHr + ':00';

      setTime({"starts":currTime, "ends": ends});
    }else{
      setTime({"starts":match.hour, "ends": match.ends});
    }
  }

  //State to show the duration of a class.
  const [classLength, setClassLength] = useState('');

  const [ classStart, setClassStart ] = useState(null);
  const [ classEnd,   setClassEnd   ] = useState(null);

  //Function to calculate the duration of a class.
  dayjs.extend(duration);
  const getDuration = (startTime, endTime) => {
    //To calculate duration dayjs() requires any date 
    //in order to work with a "yyyy-mm-dd 00:00" format.
    const baseDate = "2026-01-01";

    let start = dayjs(`${baseDate} ${startTime}`);
    let end   = dayjs(`${baseDate} ${endTime}`);

    //In case we were working with an start hour in one day
    //and end hour in the next day.
    if(end.isBefore(start)){
      end = end.add(1, "day");
    }

    //Get total minutes and hours
    const diff = dayjs.duration(end.diff(start));
    const totalH = diff.hours()   ? diff.hours()+'hr' : '';
    const totalM = diff.minutes() ? diff.minutes()+'min' : '';

    setClassLength(totalH+' '+totalM);
  }

  //Get calculation of class duration
  useEffect(() => {
    getDuration(classStart, classEnd);
  }, [classStart, classEnd])

  //Variable to show if the current day has been selected.
  const today = new Date().toLocaleDateString("en-US", {
          weekday: 'long'
        });

  //Custom hook to warn user of unsaved changes 
  //when trying to navigate to a different route.
  const useChangesProtection = (isDirty) => {
    const blocker = useBlocker(isDirty)

    // Warn user of unsaved changes when trying 
    // to navigate to a different route
    useEffect(() => {
      if(blocker.state !== "blocked") return;

      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );

      confirm ? blocker.proceed() : blocker.reset();
    }, [blocker]);

    // Warn user of unsaved changes when trying to close the tab or browser
    //it also works when trying to refresh the page
    useEffect(() => {
      const handler = (e) => {
        if (!isDirty) return;

        //Stop the unload process
        e.preventDefault();

        //Chrome requires returnValue to be set
        e.returnValue = "";
      };

      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);
  }

  const [loading, setLoading] = useState(false);

  /*  Function to get students from DB
      If it receives an id, it will return only that student
      otherwise, it will return all the students.
      Also, this function is usefull to search students.
  */
  const getStudents = async (id = null, search = null) => {
    setLoading(true);

    try{
      const studentUrl = id ? `/api/students/${id}` : '/api/students/';
      const searchUrl  = search ? `/api/students/?search=${search}` : null;
      const url = searchUrl ? searchUrl : studentUrl;

      const { data } = await axiosClient(url);

      return data.data;
    }catch(error){
      console.log("OCURRIO UN ERROR");
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  return (
    <SchoolContext.Provider 
      value = {{
        customStyles,
        handleClickModal,
        modal,
        selStudent, setSelStudent,
        selDay, setSelDay,
        handleSetTime,
        time,
        getDuration,
        classLength,
        classStart, setClassStart,
        classEnd, setClassEnd,
        handleClassModal,
        classModal,
        today,
        useChangesProtection,
        getStudents,
        loading
      }}
    >{children}
    </SchoolContext.Provider>
  )
}

export default SchoolContext

export {
  SchoolProvider
}
