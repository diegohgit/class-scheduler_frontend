import { createContext, useState, useEffect } from "react"
import { useBlocker } from "react-router-dom";
import axiosClient from "../config/axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useApi } from "../hooks/useApi";

const SchoolContext = createContext();

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
      setTime({"starts":match.starts, "ends": match.ends});
    }
  }


  //State to show the duration of a class.
  const [classLength, setClassLength] = useState('');

  //Function to calculate the duration of a class.
  dayjs.extend(duration);
  const getDuration = (time) => {
    //To calculate duration dayjs() requires any date 
    //in order to work with a "yyyy-mm-dd 00:00" format.
    const baseDate = "2026-01-01";

    let start = dayjs(`${baseDate} ${time.starts}`);
    let end   = dayjs(`${baseDate} ${time.ends}`);

    //In case we were working with an start hour in one day
    //and end hour in the next day.
    if(end.isBefore(start)){
      end = end.add(1, "day");
    }

    //Get total minutes and hours
    const diff   = dayjs.duration(end.diff(start));
    const totalH = diff.hours()   ? diff.hours()+'hr' : '';
    const totalM = diff.minutes() ? diff.minutes()+'min' : '';

    setClassLength(totalH+' '+totalM);
  }

  //Get calculation of class duration
  useEffect(() => {
    getDuration(time);
  }, [time])

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


  const { request } = useApi();


  //Function to filter by students name or level
  const filterStudents = (records, inpValue) => {

    if(inpValue.length > 1){ 
      const studentsName = inpValue.toLowerCase();

      const filteredRecords = records.filter(student => { 
        return student.name.toLowerCase().includes(studentsName) ||
               student.level.toLowerCase().includes(studentsName);
      })
      return filteredRecords;
    }
  }


  const [ classes, setClasses ] = useState([]);

  const fetchClasses = async () => {

    const url = 'api/student_classes/';
    const { success, response } = await request("GET", url, null, "Classes loaded.");

    if(success && response?.data) setClasses(response.data);
  }

  const fetchClassesReactQuery = async () => {
    const url = 'api/student_classes/';

    const { success, response } = await request("GET", url, null, "Classes loaded.");

    if(!success) throw new Error("Failed to fetch clases");
    return response.data;
  }

  //States and handler to show/hide modal chapter.
  const [modalChapter, setModalChapter] = useState(0);
  const [ selChapter, setSelChapter ]   = useState([]);

  const handleModalChapter = () => {
    setModalChapter(!modalChapter);
  }


  //states to handle section's modal.
  const [modalSection, setModalSection] = useState(0);
  const [ selSection, setSelSection ]   = useState([]);

  const handleModalSection = () => {
    setModalSection(!modalSection);
  }


  //Validate strings
  const validString = (text) => {
    if(text){
      const spacesFree = text.trim();

      if(spacesFree.length) return true;
    }
  }



  //State to define if its allowed to navigate
  //after creating or updating a student.
  const [shouldNavigate, setShouldNavigate] = useState(false)



  return (
    <SchoolContext.Provider 
      value = {{
        handleClickModal,
        modal, setModal,
        classes, setClasses,
        fetchClasses,
        fetchClassesReactQuery,
        selStudent, setSelStudent,
        selDay, setSelDay,
        handleSetTime,
        time, setTime,
        getDuration,
        classLength,
        handleClassModal,
        classModal,
        today,
        useChangesProtection,
        filterStudents,
        modalChapter, setModalChapter,
        handleModalChapter,
        selChapter, setSelChapter,
        validString,
        modalSection, setModalSection,
        handleModalSection,
        selSection, setSelSection,
        shouldNavigate, setShouldNavigate,
      }}

    >{children}
    </SchoolContext.Provider>
  )
}

export default SchoolContext

export {
  SchoolProvider
}
