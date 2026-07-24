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
  const [ modal, setModal ] = useState(null);

  //Function to show/hide the modal.
  const handleClickModal = () => {
    setModal(!modal)
  }



  //State to store the class to be shown in the modal.
  const [ classModal, setClassModal ] = useState([]);
  //Function to set the class to be shown in the modal.
  const handleClassModal = (classModal) => {

    if(!classModal){
      setClassModal([]);
      setSelStudent([]);
      return;
    }

    setClassModal(classModal);

    setSelStudent({id   : classModal.student_id,
                   name : classModal.student,
                   class_notes      : classModal.class_notes,
                   class_notes_date : classModal.class_notes_date,});
  }



  //Expand/hide class notes in ModalClass
  const [expanded, setExpanded] = useState(false);



  //Function to set the time parameters to be displayed on the modal.
  const handleSetTime = ({day, currentTime, finalSpaceMin, matchData}) => {

    setSelDay(day);

    if(!matchData){
      //Get the hour part from currentTime to calculate nextHour
      const currHour = currentTime.split(':')[0];
      const nextHour = parseInt(currHour) + 1;
      
      const formatCurrHr = currHour.toString().padStart(2, '0');
      const formatNextHr = nextHour.toString().padStart(2, '0');

      /*  If finalSpaceMin has value, is because there is a class 
          in the current hour, so 'ends' will be the start of the next class.
          Else finalSpaceMin has no value is because there's no class
          in the current hour block, so 'ends' will be the nextHour + ':00'.
      */
      const ends = finalSpaceMin ? formatCurrHr + ':' +finalSpaceMin 
                                 : formatNextHr + ':00';

      setTime({"starts":currentTime, "ends": ends});
    }else{

      setTime({"starts":matchData.starts, "ends": matchData.ends});
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

    //In case we were working with a start hour in one day
    //and end hour to the next day.
    // if(end.isBefore(start)){ end = end.add(1, "day"); }

    //Return total minutes and hours
    return dayjs.duration(end.diff(start));
  }



  //Get time in a '24Hr 50min' format.
  const getFormatedDuration = (time) => {

    const diff = getDuration(time);

    const totalH = diff.hours()   ? diff.hours()+'hr' : '';
    const totalM = diff.minutes() ? diff.minutes()+'min' : '';

    setClassLength(totalH+' '+totalM);
  }

  //Calculate class duration
  useEffect(() => {
    getFormatedDuration(time);
  }, [time])



  //Variable to show if the current day has been selected.
  const today = new Date().toLocaleDateString("en-US", {
          weekday: 'long'
        });



  //State to handle birthdate validation
  const [validDate, setValidDate] = useState(false)



  //State to define if its allowed to navigate
  //after creating or updating a student.
  const [shouldNavigate, setShouldNavigate] = useState(false)



  //Custom hook to warn user of unsaved changes 
  //when trying to navigate to a different route.
  const useChangesProtection = (isDirty) => {
    const blocker = useBlocker(isDirty)

    // Warn user of unsaved changes when trying 
    // to navigate to a different route
    useEffect(() => {
      if(blocker.state !== "blocked") return;

      //Validate shouldNavigate so we don't have to wait until isDirty comes false.
      if(shouldNavigate === false){
        const confirm = window.confirm(  
                          "You have unsaved changes. Are you sure you want to leave this page?");

        confirm ? blocker.proceed() : blocker.reset();

      }else{
        blocker.proceed();
        setShouldNavigate(false);
      }

    }, [blocker, shouldNavigate]);

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



  //Function to filter by students name or level
  const filterStudents = (records, inpValue) => {

    if(inpValue.length > 1){ 
      const studentsName = inpValue.toLowerCase();

      const filteredRecords = records.filter(student => { 
        return student?.name?.toLowerCase().includes(studentsName) ||
               student?.level?.toLowerCase().includes(studentsName);
      })
      return filteredRecords;
    }
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



  //Calculate when was the last class notes entry.
  const getFormattedDate = (date) => {

    const entryDate = dayjs(date);
    const today = dayjs();

    //Calculate how many days have passed since the last entry date.
    const days = today.startOf("day").diff(entryDate.startOf("day"), "day");

    if(days === 0) return "Today";
    if(days === 1) return "Yesterday";
    if(days >= 2)  return dayjs(date).format("DD/MMM/YYYY");
  }



  return (
    <SchoolContext.Provider 
      value = {{
        handleClickModal,
        modal, setModal,
        selStudent, setSelStudent,
        selDay, setSelDay,
        handleSetTime,
        time, setTime,
        getDuration,
        classLength,
        handleClassModal,
        classModal,
        expanded, setExpanded,
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
        validDate, setValidDate,
        shouldNavigate, setShouldNavigate,
        getFormattedDate,
      }}

    >{children}
    </SchoolContext.Provider>
  )
}

export default SchoolContext

export {
  SchoolProvider
}
